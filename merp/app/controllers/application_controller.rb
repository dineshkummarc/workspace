class ApplicationController < ActionController::Base

  before_filter :set_language
  
  protect_from_forgery

  # RESULT_STATE_OK = I18n.translate "ok"
  
  # alias_method :record_not_found, :respond_to_rnf
  # rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  # layout "main", :only => [:index]
  # layout "base", :only => [:add, :edit]
  layout :set_layout

  def respond_to_success_add(entity = nil)
    respond_to_success(I18n.translate("button.add"), entity)
  end

  def respond_to_success_update(entity = nil)
    respond_to_success(I18n.translate("button.update"), entity)
  end

  def respond_to_success_delete(cnt)
    respond_to_success("#{I18n.translate "button.delete"} (#{cnt})")
  end

  def respond_to_success(info, entity = nil)
    respond_to do | format |
      if entity
        format.html { render :json => {:k => '1', :v => I18n.t("tip.success", :title => info), :entity => entity}}
      else
        format.html { render :json => {:k => '1', :v => I18n.t("tip.success", :title => info)}}
      end
    end
  end

  def respond_to_failure(info)
    respond_to do | format |
      format.html { render :json => {:k => '0', :v => I18n.t("tip.failure", :title => info)} }
    end
  end

  def respond_to_error(info)
    respond_to do | format |
      format.html { render :json => {:k => '0', :v => info} }
    end
  end

  def respond_to_json(info)
    respond_to do | format |
      format.html { render :json => info }
    end
  end

  private

  def set_layout
    # puts "action = #{params[:action]}"
    if params[:action] == 'index'
      "main"
    else
      "base"
    end
  end


  def method_missing(id, *arguments)
    puts "method name : #{id} ; and arguments : #{arguments}";
  end

  def set_language
    # 通过当前的session得到用户使用的语言
    I18n.locale = session[:language] || I18n.default_locale 
  end

  def authorize
    if !session[:user] || session[:user] == :logged_out
      redirect_to :controller => '/admin', :action => 'login'
    end 
  end

end
