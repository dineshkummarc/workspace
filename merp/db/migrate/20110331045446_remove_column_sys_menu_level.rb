class RemoveColumnSysMenuLevel < ActiveRecord::Migration
  def self.up
    remove_column :sys_menus, :level
  end

  def self.down
    add_column :sys_menus, :level, :integer
  end
end
