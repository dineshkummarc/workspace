class AddWorkflowEntryWorkflowId < ActiveRecord::Migration
  def self.up
    add_column :workflow_entries, :workflow_id, :string, :limit => 100
  end

  def self.down
    remove_column :workflow_entries, :workflow_id
  end
end
