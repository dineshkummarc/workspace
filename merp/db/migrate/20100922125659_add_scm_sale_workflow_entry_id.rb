class AddScmSaleWorkflowEntryId < ActiveRecord::Migration
  def self.up
    add_column :scm_sales, :workflow_entry_id, :string, :limit => 36
  end

  def self.down
    remove_column :scm_sales, :workflow_entry_id
  end
end
