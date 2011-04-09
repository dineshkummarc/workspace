module AppHelper
  module InstanceMethods
    # application instance methods

    # active_record
    module Model
      # application model methods

    end

    # action_controller
    module Controller
      
      RETURN_STATUS = {:success => 'success', :fail => 'fail', :rnf => 'rnf'}

      def initialize
        super
        # puts "model_class = #{self.class.name}"
        @model_class = self.class.name.to_class_con
        @model_name  = @model_class.to_s.to_instance_name.to_sym
      end

      def index
        puts "index:::"
      end

      def page
        puts "page index:::: #{params}"
        respond_to_success @model_class.page(:where => params[@model_name])
      end

      def show
        respond_to_success @model_class.find(params[:id])
      end

      def find
        respond_to_success @model_class.where(params[@model_name]).first
      end

      def create
        instance = @model_class.new(params[@model_name])
        if instance.save
          respond_to_success
        else
          respond_to_fail instance.errors
        end
      end

      def update
        instance = @model_class.find(params[:id])
        if instance.update_attributes(params[@model_name])
          respond_to_success
        else
          respond_to_fail instance.errors
        end
      end

      def destroy
        instance = @model_class.find(params[:id])
        instance.destroy
      end

      def respond_to_rnf(name)
        # logger.error "#{name} record not found"
        respond_to_json(:k => RETURN_STATUS[:rnf], :v => "#{name} record not found")
      end

      def respond_to_fail(opts = {})
        respond_to_json(:k => RETURN_STATUS[:fail], :v => opts)
      end

      def respond_to_success(opts = {})
        respond_to_json(:k => RETURN_STATUS[:success], :v => opts)
      end

      def respond_to_json(opts = {})
        # if opts[:v].kind_of? Hash
        #   if opts[:k] == RETURN_STATUS[:success]
        #     opts[:v] = @instance
        #   elsif opts[:k] == RETURN_STATUS[:fail]
        #     opts[:v] = @instance.errors
        #   elsif opts[:k] == RETURN_STATUS[:rnf]
        #     # record not found
        #   end
        # end
        respond_to do |format|
          format.html { render :json => opts, :status => :ok }
        end
      end

    end

    # string
    module String
      # Ma::Mb::Cc => ma_mb_mcs
      def to_table_name
        self.tr_s('::', '_').downcase.pluralize
      end

      # Ma::Mb::CcController => Ma::Mb::Cc
      def to_class_con
        self[0, self.index('Controller')].singularize.constantize
      end

      def to_class
        self.singularize.constantize
      end

      # Ma::Mb::Cc => cc
      def to_instance_name
        self.split('::').last.downcase
      end
    end
  end
end
