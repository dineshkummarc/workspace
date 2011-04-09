class CreateSysCurrencies < ActiveRecord::Migration
  def self.up
    create_table :sys_currencies do |t|

      t.string :code, :limit => 30
      t.string :name, :limit => 50
      t.string :full_name, :limit => 200
      t.string :iso_code, :limit => 30
      t.timestamps
    end
  end

  def self.down
    drop_table :sys_currencies
  end
end
