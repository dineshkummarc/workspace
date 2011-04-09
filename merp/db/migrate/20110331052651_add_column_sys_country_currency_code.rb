class AddColumnSysCountryCurrencyCode < ActiveRecord::Migration
  def self.up
    add_column :sys_countries, :currency_code, :string, :limit => 30
  end

  def self.down
    remove_column :sys_countries, :currency_code
  end
end
