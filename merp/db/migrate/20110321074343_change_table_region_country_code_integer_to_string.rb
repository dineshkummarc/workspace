class ChangeTableRegionCountryCodeIntegerToString < ActiveRecord::Migration
  def self.up
    change_column :sys_regions, :country_code, :string, :limit => 30
  end

  def self.down
    change_column :sys_regions, :country_code, :integer
  end
end
