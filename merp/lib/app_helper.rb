require File.expand_path('../instance_method', __FILE__)
require File.expand_path('../class_method', __FILE__)
require File.expand_path('../workflow/os_workflow', __FILE__)

require 'active_record'
require 'action_controller'

# startup Os::workflow.init
# Os.startup


module AppHelper

  # def self.included(base)
  # base.extend(ClassMethods)
  # base.include(InstanceMethods)

  # or
  # base.send :extend, ClassMethods
  # base.send :include, InstanceMethods
  # end

  module ClassMethods
    # class methods
    # include AppClass::Model
  end

  module InstanceMethods
    # instance methods
    # include AppInstance::Model
  end

end

# extend String
String.class_eval do
  include ::AppHelper::InstanceMethods::String
end

class Reg
  NAME = /[a-zA-Z0-9_]/
  CODE = /[a-zA-Z0-9\u4E00-\u9FA5-_]/
end

# extend activeReocrd
class ActiveRecord::Base
  # include module
  include ::AppHelper::InstanceMethods::Model
  extend ::AppHelper::ClassMethods::Model

  # validate module
  validates_presence_of :code, :name
  validates_length_of :code, :maximum => 30
  validates_length_of :name, :maximum => 50
  validates_format_of :code, :with => Reg::CODE
  validates_format_of :name, :with => Reg::NAME
  # validates :code, :uniqueness => true
  # validates_uniqueness_of :code # :scope => :year, :case_sensitive => false

  # set_table_name(base.name)
  def self.inherited(base)
    super
    base.set_table_name(base.name.to_table_name)
  end

end

# extend activeRecord uuid
class ActiveRecord::Uuid < ActiveRecord::Base

  def initialize(opts = {})
    super(opts)
    self.id = opts[:id] || ActiveRecord::Base.uuid
  end

end

# extend application controller
class ::ActionController::Base
  # include ::AppHelper::InstanceMethods::Controller
end

# extend ActionController::Base
module Workflow
  class ApplicationController < ::ActionController::Base

    # include Os

    # bill index
    def index
      # get bill information by user.id
      respond_to_success ::Wf::Step::Current.where(:owner => session[:user].id).all
    end

    # bill show
    def show
      # get bill information by bill.id
      current_bill = yield
      step = ::Wf::Step::Current.where(:entry_id => current_bill.workflow_entry_id, :id => current.step_id).first
      unless step
        logger.error "workflow step not found"
        respond_to_rnf "workflow step"
      else
        [current_bill, step]
      end
    end

    # bill apply 
    def apply
      #begin
        ::Wf::Entry.transaction do
          @entry = ::Wf::Entry.new(:name => params[:workflow], :workflow_id => params[:workflow], :status => ::Os::STATUS_UNDERWAY)
          unless @entry.save
            logger.error "workflow entry save error"
            respond_to_fail @entry.errors
          else
            ::Os.workflows[params[:workflow]].start_step.each { |result| save_step_current(result, 1) }
            respond_to_success 
          end
          # yield @entry
        end
      #rescue Exception => ex
        #logger.error "errors: #{ex.message}"
      #end
    end

    # bill audit
    def audit
      begin
        ::Wf::Entry.transaction do
          @entry = ::Wf::Entry.find(params[:workflow_entry_id])

          step = ::Wf::Step::Current.where(:entry_id => @entry.id, :id => params[:workflow_step_current_id]).first
          unless step
            logger.error "not found current step in workflow #{@entry.workflow_id}"
            # respond_to_rnf
            return
          end

          # current user only execute one step
          step.status = ::Os::STATUS_FINISHED
          step.remark = params[:workflow_step_remark]
          step.destroy
          ::Os.workflows[@entry.workflow_id].next_step(step).each { |result| save_step_current(result, step.index) }
        end
      rescue Exception => ex
        logger.error "error: #{ex.message}"
      end
    end

    # bill back
    def back
      begin
        @entry = ::Wf::Entry.find(params[:workflow_entry_id])
        if !@entry.update_attributes(:status => ::Os.STATUS_ROLLBACK)
          logger.error "workflow entry update error"
          respond_to_fail @entry.errors
          return
        end
        step = ::Wf::Step::Current.where(:entry_id => @entry.id, :id => params[:workflow_step_current_id]).first

        unless step
          logger.error "not found current step in workflow #{@entry.workflow_id}"
          return
        end

        # current user only execute one step
        step.status = ::Os::STATUS_ROLLBACK
        step.remark = params[:workflow_step_remark]
        step.destroy
        # workflows[@entry.workflow_id].next_step(step).each { |result| save_step_current(result) }
      rescue Exception => ex
        logger.error "error: #{ex.message}"
      end
    end

    private

    def save_step_current(result, index)
      puts "result:::#{result.to_json}"
      step = {:id => result.step_id, :entry_id => @entry.id, :type => result.type,
        :owner => result.owner, :status => result.status, :index => index}
      logger.error "workflow step currents save error" unless ::Wf::Step::Current.new(step).save
    end

  end
end



