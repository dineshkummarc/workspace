class CreateWorkflowStepCurrents < ActiveRecord::Migration
  def self.up
    create_table :workflow_step_currents, :id => false do |t|
      t.string :id, :limit => 36
      t.string :entry_id, :limit => 36
      t.string :owner, :limit => 36
      t.integer :status
      t.integer :index
      t.timestamps
    end
  end

  def self.down
    drop_table :workflow_step_currents
  end
end
