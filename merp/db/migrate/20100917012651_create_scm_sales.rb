class CreateScmSales < ActiveRecord::Migration
  def self.up
    create_table :scm_sales, :id => false do |t|

      t.string :id, :limit => 36
      t.string :name, :limit => 50
      t.string :describe, :limit => 250
      t.timestamps
    end
  end

  def self.down
    drop_table :scm_sales
  end
end
