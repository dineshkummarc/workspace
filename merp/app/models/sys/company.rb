class Sys::Company < ActiveRecord::Base

  validates_presence_of :language_code, :country_code, :currency_code

  validates_each :language_code, :country_code, :currency_code do |model, attr, value|
    if !value.blank?
      instance_name = attr.to_s.split('_')[0]
      model.errors.add(attr, "#{instance_name} not found") if "Sys::#{instance_name.titleize}".to_class.where(:code => value).count <= 0
    end
  end

end
