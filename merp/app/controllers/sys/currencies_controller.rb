class Sys::CurrenciesController < ApplicationController
  def index; end
  def page
    respond_to_json Sys::Currency.page(:where => params[:currency], :page => params[:page])
  end

  def new; end
  def edit; @currency = Sys::Currency.find(params[:id]) end

  def create
    currency = Sys::Currency.new(params[:currency])
    if currency.save
      respond_to_success_add
    else
      respond_to_error currency.errors
    end
  end

  def update
    currency = Sys::Currency.find(params[:id])
    if currency.update_attributes(params[:currency])
      respond_to_success_update
    else
      respond_to_error currency.errors
    end
  end

  def delete_all
    count = Sys::Currency.where(:id => params[:ids]).delete_all
    respond_to_success_delete count
  end
end
