class AddRemarkWorkflowStepHistories < ActiveRecord::Migration
  def self.up
    add_column :workflow_step_histories, :remark, :string, :limit => 500
  end

  def self.down
    remove_column :workflow_step_histories, :remark
  end
end
