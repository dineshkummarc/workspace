class Sys::RegionsController < ApplicationController
  def index; end
  def page
    respond_to_json Sys::Region.page(:where => params[:region], :page => params[:page])
  end

  def new; end
  def edit; @region = Sys::Region.find(params[:id]) end

  def create
    region = Sys::Region.new(params[:region])
    if region.save
      respond_to_success_add
    else
      respond_to_error region.errors
    end
  end

  def update
    region = Sys::Region.find(params[:id])
    if region.update_attributes(params[:region])
      respond_to_success_update
    else
      respond_to_error region.errors
    end
  end

  def delete_all
    count = Sys::Region.where(:id => params[:ids]).delete_all
    respond_to_success_delete count
  end
end
