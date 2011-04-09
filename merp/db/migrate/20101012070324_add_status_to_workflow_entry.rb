class AddStatusToWorkflowEntry < ActiveRecord::Migration
  def self.up
    add_column :workflow_entries, :status, :string, :limit => 10, :default => 'queued'
  end

  def self.down
    remove_column :workflow_entries, :status
  end
end
