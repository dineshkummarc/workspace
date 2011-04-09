# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110331052651) do

  create_table "scm_sales", :id => false, :force => true do |t|
    t.string   "id",                :limit => 36
    t.string   "name",              :limit => 50
    t.string   "describe",          :limit => 250
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "workflow_entry_id", :limit => 36
  end

  create_table "sys_companies", :force => true do |t|
    t.string   "code",          :limit => 30
    t.string   "name",          :limit => 50
    t.string   "full_name",     :limit => 200
    t.string   "street",        :limit => 200
    t.string   "postal_code",   :limit => 20
    t.string   "city",          :limit => 50
    t.string   "country_code",  :limit => 30
    t.string   "language_code", :limit => 30
    t.string   "currency_code", :limit => 30
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sys_countries", :force => true do |t|
    t.string   "code",          :limit => 30
    t.string   "name",          :limit => 50
    t.string   "full_name",     :limit => 200
    t.string   "language_code", :limit => 30
    t.integer  "date_format"
    t.integer  "num_format"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "currency_code", :limit => 30
  end

  create_table "sys_currencies", :force => true do |t|
    t.string   "code",       :limit => 30
    t.string   "name",       :limit => 50
    t.string   "full_name",  :limit => 200
    t.string   "iso_code",   :limit => 30
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sys_languages", :force => true do |t|
    t.string   "code",       :limit => 30
    t.string   "name",       :limit => 50
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sys_menus", :force => true do |t|
    t.string   "code",       :limit => 30
    t.string   "name",       :limit => 50
    t.string   "url",        :limit => 20
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "leaf"
    t.string   "parent_id",  :limit => 30
  end

  create_table "sys_regions", :force => true do |t|
    t.string   "code",         :limit => 30
    t.string   "name",         :limit => 50
    t.string   "country_code", :limit => 30
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sys_units", :force => true do |t|
    t.string   "code",       :limit => 30
    t.string   "name",       :limit => 50
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sys_users", :id => false, :force => true do |t|
    t.string   "id",         :limit => 36
    t.string   "name",       :limit => 50
    t.string   "code",       :limit => 30
    t.string   "password",   :limit => 20
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "wf_entries", :id => false, :force => true do |t|
    t.string   "id",          :limit => 36
    t.string   "name",        :limit => 50
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "workflow_id", :limit => 100
    t.string   "status",      :limit => 10,  :default => "queued"
  end

  create_table "wf_groups", :force => true do |t|
    t.string   "name",       :limit => 50
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "wf_step_currents", :id => false, :force => true do |t|
    t.string   "id",         :limit => 36
    t.string   "entry_id",   :limit => 36
    t.string   "owner",      :limit => 36
    t.integer  "status"
    t.integer  "index"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "type",       :limit => 10
  end

  create_table "wf_step_histories", :force => true do |t|
    t.string   "entry_id",   :limit => 36
    t.string   "owner",      :limit => 36
    t.integer  "status"
    t.integer  "index"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "type",       :limit => 10
    t.string   "remark",     :limit => 500
  end

  create_table "wf_users", :force => true do |t|
    t.string   "name",       :limit => 50
    t.integer  "group_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
