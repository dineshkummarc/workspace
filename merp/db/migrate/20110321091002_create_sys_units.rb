class CreateSysUnits < ActiveRecord::Migration
  def self.up
    create_table :sys_units do |t|

      t.string :code, :limit => 30
      t.string :name, :limit => 50
      t.timestamps
    end
  end

  def self.down
    drop_table :sys_units
  end
end
