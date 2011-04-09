class AddTypeToStepCurrents < ActiveRecord::Migration
  def self.up
    add_column :workflow_step_currents, :type, :string, :limit => 10
  end

  def self.down
    remove_column :workflow_step_currents, :type
  end
end
