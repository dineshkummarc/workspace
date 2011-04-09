class Sys::IndexController < ApplicationController

  def index
    respond_to do |format|
      format.html { render :file => '/sys/index.html.erb', :use_full_path => true }
    end
  end

end
