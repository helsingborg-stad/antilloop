# frozen_string_literal: true

class SensorForm < Reform::Form
  property :external_id
  property :name
  property :device
  property :location
  property :battery_level

  validates :external_id, presence: true
  validates :name, presence: true
  validates :device, presence: true, inclusion: { in: Sensor::KNOWN_DEVICES }
end
