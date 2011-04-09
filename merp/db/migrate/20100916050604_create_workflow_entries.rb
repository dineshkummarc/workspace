class CreateWorkflowEntries < ActiveRecord::Migration
  def self.up
    create_table :workflow_entries, :id => false do |t|

      t.string :id, :limit => 36, :primary => true
      t.string :name, :limit => 50
      t.timestamps
    end
  end

  def self.down
    drop_table :workflow_entries
  end
end
