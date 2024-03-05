# frozen_string_literal: true

module Sensors
  class SaveSensorSync < Service
    def initialize(sensor, value)
      @sensor = sensor
      @value = value
    end

    def call
      sensor.syncs.create!(data:, value:, reported_at:)

      data!(sensor)
    end

    private

    attr_reader :sensor, :value

    def sensor_sync_value
      return SyneticaEnlink::SensorSyncValue.new(value) if sensor.synetica_enlink?
      return Montem::SensorSyncValue.new(value) if sensor.montem?

      SensorSyncValue.new(value)
    end

    def data
      sensor_sync_value.data
    end

    def reported_at
      sensor_sync_value.reported_at
    end
  end
end
