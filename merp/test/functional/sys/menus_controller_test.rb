require 'test_helper'

class Sys::MenusControllerTest < ActionController::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end

  test "create new menu" do
    assert_difference('Sys::Menu.count') do
      post :create, :post => {:code => 'tt', :name => 'Ttt'}
    end
  end
end
