class CreateSysMenus < ActiveRecord::Migration
  def self.up
    create_table :sys_menus do |t|

      t.string :code, :limit => 30
      t.string :name, :limit => 50
      t.string :url, :limit => 20
      t.integer :parent_id, :default => 0
      t.timestamps
    end
  end

  def self.down
    drop_table :sys_menus
  end
end
