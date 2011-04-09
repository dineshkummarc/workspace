class RenameTableMenuParentIdToCode < ActiveRecord::Migration
  def self.up
    # change_column :sys_menus, :parent_id, :parent_code, :string
    remove_column :sys_menus, :parent_id
    add_column :sys_menus, :parent_code, :string, :limit => 30
  end

  def self.down
    remove_column :sys_menus, :parent_code
    add_column :sys_menus, :parent_id, :integer
  end
end
