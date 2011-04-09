class Sys::CompaniesController < ApplicationController
  def index; end
  def page
    respond_to_json Sys::Company.page(:where => params[:company], :page => params[:page])
  end

  def new; end
  def edit; @company = Sys::Company.find(params[:id]) end

  def create
    company = Sys::Company.new(params[:company])
    if company.save
      respond_to_success_add
    else
      respond_to_error company.errors
    end
  end

  def update
    company = Sys::Company.find(params[:id])
    if company.update_attributes(params[:company])
      respond_to_success_update
    else
      respond_to_error company.errors
    end
  end

  def delete_all
    count = Sys::Company.where(:id => params[:ids]).delete_all
    respond_to_success_delete count
  end
end
