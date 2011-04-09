class CreateWorkflowUsers < ActiveRecord::Migration
  def self.up
    create_table :workflow_users do |t|

      t.string :name, :limit => 50
      t.integer :group_id
      t.timestamps
    end
  end

  def self.down
    drop_table :workflow_users
  end
end
