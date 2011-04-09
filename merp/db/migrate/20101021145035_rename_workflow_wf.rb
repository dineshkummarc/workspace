class RenameWorkflowWf < ActiveRecord::Migration
  def self.up
    rename_table :workflow_entries, :wf_entries
    rename_table :workflow_step_currents, :wf_step_currents
    rename_table :workflow_step_histories, :wf_step_histories
    rename_table :workflow_gourps, :wf_groups
    rename_table :workflow_users, :wf_users
  end

  def self.down
  end
end
