require File.expand_path('../uuid/uuidtools', __FILE__)

module AppHelper
  module ClassMethods
    # application class methods

    module Model
      # application model methods

      # extends active_record key id
      def uuid
        UUIDTools::UUID.random_create.to_s 
      end

      # data paginate
      # :select => "", :where => [] or {}, :like => [], :gt => [], :lt => []
      # :order => "", :group => "", :page
      def page(options = {})
        # select, where, like, gt, lt = false, {}, [], [], []
        like, gt, lt, pg, ret = {'name' => true, 'code' => true}, {}, {}, Classes::Page.new, {:k => '-1', :v => []}

        options[:group] ||= false
        options[:order] ||= " created_at asc "
        options[:like].each {|v| like[v] = true } if options[:like]
        options[:gt].each {|v| gt[v] = true } if options[:gt]
        options[:lt].each {|v| lt[v] = true } if options[:lt]

        # puts "::#{like.to_s}:::#{options[:like].to_s}<<::::"
        sql = self
        sql = select(options[:select]) if options[:select]
        if options[:where]
          if options[:where].kind_of? Array
            sql = sql.where(options[:where])
          elsif options[:where].kind_of? Hash
            key, val = [], []
            options[:where].each do |k, v|
              next unless v && v !~ /^\s*$/
                if like[k]
                  key << "#{k} like ?"
                  val << "#{v}%"
                elsif gt[k]
                  key << "#{k} >= ?"
                  val << v
                elsif lt[k]
                  key << "#{k} <= ?"
                  val << v
                else
                  key << "#{k} = ?"
                  val << v
                end
            end
            # puts "where"
            sql = sql.where([key.join(" and ")].concat(val))
          end
        end
        sql = sql.order(options[:order])
        if options[:group]
          sql = sql.group(options[:group])
        end
        if options[:page]
          pg.index = options[:page][:index] || pg.index
          pg.page_rows = options[:page][:page_rows] || pg.page_rows
          # puts ":::::page:#{options[:page][:index]}"
          # pg.refresh = options[:page][:refresh] || pg.refresh
        end

        ret[:k] = sql.count if pg.refresh
        # puts "page : #{pg.get_page_rows} :: #{page.offset}"
        ret[:v] = sql.limit(pg.page_rows).offset(pg.offset).all
        ret

      end

    end
  end
end

module Classes
  class Page
    def initialize
      @index = 0
      @page_rows = 15
      @rows = 20
      @pages = 1
      # @refresh = false
    end

    attr_accessor :index, :page_rows, :rows, :pages

    def refresh
      Integer(@index) == 0 ? true : false
    end

    def offset
      Integer(@index) * page_rows
    end

  end
end
