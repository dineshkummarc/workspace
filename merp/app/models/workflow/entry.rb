class Workflow::Entry < ActiveRecord::Uuid
  has_many :step_currents, :class_name => 'Workflow::Step::Current'
  has_many :step_histories, :class_name => 'Workflow::Step::History'
end
