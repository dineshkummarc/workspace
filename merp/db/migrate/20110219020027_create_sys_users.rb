class CreateSysUsers < ActiveRecord::Migration
  def self.up
    create_table :sys_users, :id => false do |t|

      t.string :id, :limit => 36, :primary => true
      t.string :name, :limit => 50
      t.string :code, :limit => 30
      t.string :password, :limit => 20
      t.timestamps
    end
  end

  def self.down
    drop_table :sys_users
  end
end
