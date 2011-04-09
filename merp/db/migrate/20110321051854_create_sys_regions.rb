class CreateSysRegions < ActiveRecord::Migration
  def self.up
    create_table :sys_regions do |t|

      t.string :code, :limit => 30
      t.string :name, :limit => 50
      t.integer :country_id
      t.timestamps
    end
  end

  def self.down
    drop_table :sys_regions
  end
end
