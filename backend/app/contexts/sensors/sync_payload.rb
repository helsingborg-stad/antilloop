# frozen_string_literal: true

module Sensors
  class SyncPayload
    def initialize(payload)
      @payload = payload
    end

    attr_reader :payload

    def external_id
      payload.dig(:iotnode, :_id)
    end

    def name
      context_map[:name]
    end

    def device
      Sensor.read_device_name(context_map[:device])
    end

    def location
      context_map[:location]
    end

    def context_map
      @context_map ||= payload.dig(:iotnode, :contextMap)&.transform_keys { |key| key.downcase.to_s.strip.to_sym } || {}
    end

    def battery_level
      payload.dig(:iotnode, :value, :BatteryLevel)
    end

    def value
      iotnode
    end

    def iotnode
      @iotnode ||= payload[:iotnode]
    end

    def sensor_hash
      {
        external_id:,
        name:,
        device:,
        location:,
        battery_level:
      }
    end
  end
end
