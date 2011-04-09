class Sys::Menu < ActiveRecord::Base

  DEFAULT_PARENT_MENU = 1
  LEAF_YES = 1
  LEAF_NO = 0

  # validates_presence_of :parent_code
  validates_each :parent_id do |model, attr, value|
    if(value !~ /^\s*$/ && !model.default_parent_id)
      model.errors.add(attr, 'parent menu not found') if Sys::Menu.where(:id => value).count <= 0
    end
  end

  def before_save
    if self.parent_id =~ /^\s*$/ || default_parent_id
      # self.parent_id = NO_PARENT_MENU
      # self.level = 1
    else
      parent = Sys::Menu.find(self.parent_id)
      if parent.leaf == LEAF_YES
        parent.leaf = LEAF_NO
        parent.save
      end

      # self.level = parent.level + 1
      # self.leaf = LEAF_YES;
    end
  end

  # def get_parent_code
  #   if self.parent_id !~ /^\s*$/ && Integer(self.parent_id) == NO_PARENT_MENU
  #     ""
  #   else
  #     self.parent_id;
  #   end
  # end

  def default_parent_id
    Integer(self.parent_id) == DEFAULT_PARENT_MENU ? true : false
  end

end
