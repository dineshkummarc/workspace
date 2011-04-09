class Wf::Step::History < ActiveRecord::Uuid
  
  belong_to :entry, :class_name => 'Wf::Entry'
  
end