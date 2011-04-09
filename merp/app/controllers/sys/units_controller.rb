class Sys::UnitsController < ApplicationController
  def index; end
  def page
    respond_to_json Sys::Unit.page(:where => params[:unit], :page => params[:page])
  end

  def new; end
  def edit; @unit = Sys::Unit.find(params[:id]) end

  def create
    unit = Sys::Unit.new(params[:unit])
    if unit.save
      respond_to_success_add
    else
      respond_to_error unit.errors
    end
  end

  def update
    unit = Sys::Unit.find(params[:id])
    if unit.update_attributes(params[:unit])
      respond_to_success_update
    else
      respond_to_error unit.errors
    end
  end

  def delete_all
    count = Sys::Unit.where(:id => params[:ids]).delete_all
    respond_to_success_delete count
  end
end
