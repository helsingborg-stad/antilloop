# frozen_string_literal: true

module Sensors
  class SensorSyncValue
    def initialize(value)
      @value = value
    end

    def data
      value.transform_keys(&:underscore).merge(date: reported_at)
    end

    def reported_at
      (value_reported_at || default_reported_at).utc.iso8601
    end

    def value_reported_at
      return if value.dig('encodedData', 'timestamp').blank?

      Time.zone.parse(value.dig('encodedData', 'timestamp')).utc
    end

    private

    attr_reader :value

    def default_reported_at
      Time.zone.now.utc
    end
  end
end
