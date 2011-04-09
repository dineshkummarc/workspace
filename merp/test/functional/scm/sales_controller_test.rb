require 'test/test_helper'

class Scm::SalesControllerTest < ActionController::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end

  test "save sale" do
    assert_difference "Scm::Sale.count", 1 do
      post :create, :sale => {:id => 22, :name => 'myliang', :describe => 'ddddddddddddddd'}
    end
  end
end
