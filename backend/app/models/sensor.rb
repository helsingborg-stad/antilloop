# frozen_string_literal: true

class Sensor < ApplicationRecord
  KNOWN_DEVICES = %w[
    elsys_ers_co2
    elsys_ers_sound
    yosensi_agri_box
    decentlab_dl_pm
    montem
    synetica_enlink
  ].freeze

  paginates_per 25

  belongs_to :school, optional: true

  has_many :syncs, class_name: 'SensorSync', dependent: :destroy
  has_many :data, class_name: 'SensorSync', dependent: :destroy
  has_many :widgets, as: :data_source, dependent: :nullify
  has_many :sections, through: :widgets

  has_one :latest_data, -> { order_by_reported_at_desc },
          class_name: 'SensorSync',
          inverse_of: :sensor,
          primary_key: :latest_data_id,
          foreign_key: :id,
          dependent: :destroy
  has_one :latest_present_data, -> { order_by_reported_at_desc },
          class_name: 'SensorSync',
          inverse_of: :sensor,
          primary_key: :latest_present_data_id,
          foreign_key: :id,
          dependent: :destroy
  has_one :current_data, lambda {
                           by_reported_at(
                             Time.zone.now.utc.beginning_of_day.iso8601,
                             Time.zone.now.utc.end_of_day.iso8601
                           )
                             .order_by_reported_at_desc
                         },
          class_name: 'SensorSync',
          inverse_of: :sensor,
          primary_key: :current_data_id,
          foreign_key: :id,
          dependent: :destroy

  enum :status, { inactive: 0, active: 1 }

  scope :with_latest_data, lambda {
    select(%(
      sensors.*,
      (
        SELECT id as latest_data_id
        FROM sensor_syncs
        WHERE sensor_id = sensors.id
        ORDER BY reported_at desc
        LIMIT 1
      )
    ))
  }
  scope :with_latest_present_data, lambda {
    select(%(
      sensors.*,
      (
        SELECT id as latest_present_data_id
        FROM sensor_syncs
        WHERE sensor_id = sensors.id
        ORDER BY reported_at desc
        LIMIT 1
      )
    ))
  }
  scope :with_current_data, lambda {
    select(%(
      sensors.*,
      (
        SELECT id as current_data_id
        FROM sensor_syncs
        WHERE sensor_id = sensors.id AND
          reported_at >= '#{Time.zone.now.utc.beginning_of_day.iso8601}' AND
            reported_at <= '#{Time.zone.now.utc.end_of_day.iso8601}'
        ORDER BY reported_at desc
        LIMIT 1
      )
    ))
  }

  KNOWN_DEVICES.each do |device|
    define_method("#{device}?") { self.device == device }
  end

  def self.read_device_name(device_name)
    device_name.parameterize.underscore if device_name.present?
  end

  def self.read_location(location)
    location.parameterize.underscore if location.present?
  end

  def battery_level_pct
    return nil if battery_level.nil?

    (battery_level.to_f / 256 * 100).round(2)
  end

  def key = device

  def connected?(page:, section:)
    widgets.where(page:, section:).any?
  end
end
