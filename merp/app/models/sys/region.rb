class Sys::Region < ActiveRecord::Base

  validates_presence_of :country_code
  validates_each :country_code do |model, attr, value|
    model.errors.add(attr, 'country code not found') if Sys::Country.where(:code => value).count <= 0
  end

end
