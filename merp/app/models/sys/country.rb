class Sys::Country < ActiveRecord::Base
  validates_length_of :full_name, :maximum => 200
  validates_format_of :full_name, :with => ::Reg::NAME

  validates_presence_of :language_code
  validates_each :language_code do |model, attr, value|
    model.errors.add(attr, 'language not found') if Sys::Language.where(:code => value).count <= 0
  end

end
