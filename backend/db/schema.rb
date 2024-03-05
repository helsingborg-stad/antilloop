# frozen_string_literal: true

# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 20_231_027_091_927) do
  # These are extensions that must be enabled in order to support this database
  enable_extension 'plpgsql'

  create_table 'active_storage_attachments', force: :cascade do |t|
    t.string 'name', null: false
    t.string 'record_type', null: false
    t.bigint 'record_id', null: false
    t.bigint 'blob_id', null: false
    t.datetime 'created_at', null: false
    t.index ['blob_id'], name: 'index_active_storage_attachments_on_blob_id'
    t.index %w[record_type record_id name blob_id], name: 'index_active_storage_attachments_uniqueness',
                                                    unique: true
  end

  create_table 'active_storage_blobs', force: :cascade do |t|
    t.string 'key', null: false
    t.string 'filename', null: false
    t.string 'content_type'
    t.text 'metadata'
    t.string 'service_name', null: false
    t.bigint 'byte_size', null: false
    t.string 'checksum'
    t.datetime 'created_at', null: false
    t.index ['key'], name: 'index_active_storage_blobs_on_key', unique: true
  end

  create_table 'active_storage_variant_records', force: :cascade do |t|
    t.bigint 'blob_id', null: false
    t.string 'variation_digest', null: false
    t.index %w[blob_id variation_digest], name: 'index_active_storage_variant_records_uniqueness', unique: true
  end

  create_table 'integrations', force: :cascade do |t|
    t.string 'name'
    t.string 'key'
    t.string 'url'
    t.jsonb 'settings', default: {}
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
  end

  create_table 'pages', force: :cascade do |t|
    t.string 'name'
    t.bigint 'school_id', null: false
    t.boolean 'home_page', default: false, null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['school_id'], name: 'index_pages_on_school_id'
  end

  create_table 'school_integration_syncs', force: :cascade do |t|
    t.bigint 'school_integration_id', null: false
    t.jsonb 'data', default: {}
    t.integer 'status', default: 0
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.jsonb 'value'
    t.integer 'likes_count', default: 0
    t.string 'data_source_key', default: '', null: false
    t.datetime 'reported_at'
    t.jsonb 'ducky', default: {}
    t.index ['data_source_key'], name: 'index_school_integration_syncs_on_data_source_key'
    t.index ['reported_at'], name: 'index_school_integration_syncs_on_reported_at'
    t.index ['school_integration_id'], name: 'index_school_integration_syncs_on_school_integration_id'
  end

  create_table 'school_integrations', force: :cascade do |t|
    t.bigint 'integration_id', null: false
    t.bigint 'school_id', null: false
    t.integer 'status', default: 0
    t.jsonb 'settings'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['integration_id'], name: 'index_school_integrations_on_integration_id'
    t.index ['school_id'], name: 'index_school_integrations_on_school_id'
  end

  create_table 'schools', force: :cascade do |t|
    t.string 'name'
    t.string 'main_color'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
  end

  create_table 'sections', force: :cascade do |t|
    t.string 'name'
    t.boolean 'link', default: false, null: false
    t.bigint 'page_id', null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.integer 'sn', default: 0, null: false
    t.string 'theme'
    t.boolean 'school_page', default: true, null: false
    t.boolean 'school_page_overview', default: true, null: false
    t.index ['page_id'], name: 'index_sections_on_page_id'
  end

  create_table 'sensor_syncs', force: :cascade do |t|
    t.jsonb 'value', default: {}
    t.bigint 'sensor_id', null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.jsonb 'data', default: {}
    t.datetime 'reported_at'
    t.index ['reported_at'], name: 'index_sensor_syncs_on_reported_at'
    t.index ['sensor_id'], name: 'index_sensor_syncs_on_sensor_id'
  end

  create_table 'sensors', force: :cascade do |t|
    t.string 'name'
    t.integer 'status', default: 0
    t.string 'battery_level'
    t.integer 'school_id'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.string 'location'
    t.string 'device'
    t.string 'external_id'
    t.index ['school_id'], name: 'index_sensors_on_school_id'
  end

  create_table 'user_invites', force: :cascade do |t|
    t.string 'email', null: false
    t.string 'status', default: 'pending'
    t.datetime 'accepted_at'
    t.bigint 'school_id', null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['school_id'], name: 'index_user_invites_on_school_id'
  end

  create_table 'users', force: :cascade do |t|
    t.string 'email'
    t.string 'name'
    t.bigint 'school_id', null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['email'], name: 'index_users_on_email', unique: true
    t.index ['school_id'], name: 'index_users_on_school_id'
  end

  create_table 'widgets', force: :cascade do |t|
    t.bigint 'data_source_id'
    t.string 'data_source_type'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.bigint 'page_id', null: false
    t.bigint 'section_id'
    t.integer 'sn', default: 0, null: false
    t.string 'name'
    t.string 'data_source_key'
    t.index %w[data_source_type data_source_id], name: 'index_widgets_on_data_source_type_and_data_source_id'
    t.index ['page_id'], name: 'index_widgets_on_page_id'
    t.index ['section_id'], name: 'index_widgets_on_section_id'
  end

  add_foreign_key 'active_storage_attachments', 'active_storage_blobs', column: 'blob_id'
  add_foreign_key 'active_storage_variant_records', 'active_storage_blobs', column: 'blob_id'
  add_foreign_key 'pages', 'schools'
  add_foreign_key 'school_integration_syncs', 'school_integrations'
  add_foreign_key 'school_integrations', 'integrations'
  add_foreign_key 'school_integrations', 'schools'
  add_foreign_key 'sections', 'pages'
  add_foreign_key 'sensor_syncs', 'sensors'
  add_foreign_key 'sensors', 'schools'
  add_foreign_key 'user_invites', 'schools'
  add_foreign_key 'users', 'schools'
  add_foreign_key 'widgets', 'pages'
  add_foreign_key 'widgets', 'sections'
end
