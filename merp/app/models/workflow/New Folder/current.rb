class Workflow::Step::Current < ActiveRecord::Uuid
  belongs_to :entries, :class_name => 'Workflow::Entry'

  before_destroy { |step| History.new(step).save }
  
end
