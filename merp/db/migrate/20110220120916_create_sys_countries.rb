class CreateSysCountries < ActiveRecord::Migration
  def self.up
    create_table :sys_countries do |t|

      t.string :code, :limit => 30
      t.string :name, :limit => 50
      t.string :full_name, :limit => 200
      t.string :language_code, :limit => 30
      t.integer :date_format
      t.integer :num_format
      t.timestamps
    end
  end

  def self.down
    drop_table :sys_countries
  end
end
