class Workflow::Step::History < ActiveRecord::Uuid
  belongs_to :entries, :class_name => 'Workflow::Entry'
end
