class RenameTableMenuParentCodeToId < ActiveRecord::Migration
  def self.up
    remove_column :sys_menus, :parent_code
    add_column :sys_menus, :parent_id, :string, :limit => 30
  end

  def self.down
    remove_column :sys_menus, :parent_id
    add_column :sys_menus, :parent_code, :integer
  end
end
