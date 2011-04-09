class CreateSysCompanies < ActiveRecord::Migration
  def self.up
    create_table :sys_companies do |t|

      t.string :code, :limit => 30
      t.string :name, :limit => 50
      t.string :full_name, :limit => 200
      t.string :street, :limit => 200
      t.string :postal_code, :limit => 20
      t.string :city, :limit => 50
      t.string :country_code, :limit => 30
      t.string :language_code, :limit => 30
      t.string :currency_code, :limit => 30
      t.timestamps
    end
  end

  def self.down
    drop_table :sys_companies
  end
end
