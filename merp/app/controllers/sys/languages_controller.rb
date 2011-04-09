class Sys::LanguagesController < ApplicationController

  def index; end
  def page
    respond_to_json Sys::Language.page(:where => params[:language], :page => params[:page])
  end

  def new; end
  def edit; @language = Sys::Language.find(params[:id]) end

  def create
    language = Sys::Language.new(params[:language])
    if language.save
      respond_to_success_add
    else
      respond_to_error language.errors
    end
  end

  def update
    language = Sys::Language.find(params[:id])
    if language.update_attributes(params[:language])
      respond_to_success_update
    else
      respond_to_error language.errors
    end
  end

  def delete_all
    count = Sys::Language.where(:id => params[:ids]).delete_all
    respond_to_success_delete count
  end
end
