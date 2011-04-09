class AddColumnsLevelLeafToSysMenus < ActiveRecord::Migration
  def self.up
    add_column :sys_menus, :level, :integer
    add_column :sys_menus, :leaf, :integer
  end

  def self.down
    remove_column :sys_menus, :level
    remove_column :sys_menus, :leaf
  end
end
