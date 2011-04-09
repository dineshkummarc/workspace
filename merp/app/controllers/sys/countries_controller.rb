class Sys::CountriesController < ApplicationController
  def index
    # index
  end

  def page
    # page
    respond_to_json Sys::Country.page(:where => params[:country], :page => params[:page])
  end

  def create
    # create
    country = Sys::Country.new(params[:country])
    if country.save
      respond_to_success_add
    else
      respond_to_error country.errors
    end

  end

  def update
    # update
    country = Sys::Country.find(params[:id])
    if country.update_attributes(params[:country])
      respond_to_success_update
    else
      respond_to_error country.errors
    end
  end

  def destroy
    # destroy
    puts "ids => #{params[:ids]}"

  end

  def delete_all
    count = Sys::Country.where(:id => params[:ids]).delete_all
    respond_to_success_delete count
  end

  def show
    # show
  end

  def new
    # new
  end

  def edit
    # edit
    @country = Sys::Country.find(params[:id])
  end
end

