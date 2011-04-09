class Sys::MenusController < ApplicationController
  def index; end
  def tree
    params[:menu] ||= {}
    params[:menu][:parent_id] = params[:pid]
    pg = Sys::Menu.page(:where => params[:menu], :page => params[:page])
    respond_to_json pg[:v]
  end

  def new; end
  def edit; @menu = Sys::Menu.find(params[:id]) end

  def create
    menu = Sys::Menu.new(params[:menu])
    menu.leaf = Sys::Menu::LEAF_YES;

    if menu.save
      respond_to_success_add menu
    else
      respond_to_error menu.errors
    end
  end

  def update
    menu = Sys::Menu.find(params[:id])
    if menu.update_attributes(params[:menu])
      respond_to_success_update menu
    else
      respond_to_error menu.errors
    end
  end

  def delete_all
    count = Sys::Menu.where(:id => params[:ids]).delete_all
    respond_to_success_delete count
  end

  def destroy
    count = Sys::Menu.where(:id => params[:id]).delete_all
    respond_to_success_delete count
  end
end
