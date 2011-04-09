class CreateWorkflowGourps < ActiveRecord::Migration
  def self.up
    create_table :workflow_gourps do |t|

      t.string :name, :limit => 50
      t.timestamps
    end
  end

  def self.down
    drop_table :workflow_gourps
  end
end
