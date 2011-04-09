class ChangeRegionCountryIdToCode < ActiveRecord::Migration
  def self.up
    rename_column :sys_regions, :country_id, :country_code
  end

  def self.down
    rename_column :sys_regions, :country_code, :country_id
  end
end
