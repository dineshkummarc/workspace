class Wf::Step::Current < ActiveRecord::Uuid
  
  belong_to :entry, :class_name => 'Wf::Entry'
  
end