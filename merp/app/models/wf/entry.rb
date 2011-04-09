class Wf::Entry < ActiveRecord::Uuid
  has_many :step_currents, :class_name => 'Wf::Step::Current'
  has_many :step_histories, :class_name => 'Wf::Step::History'
end
