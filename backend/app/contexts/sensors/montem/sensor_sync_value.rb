# frozen_string_literal: true

module Sensors
  module Montem
    class SensorSyncValue < Sensors::SensorSyncValue
      # rubocop:disable Metrics/MethodLength
      def data
        super.transform_keys do |key|
          case key
          when 'pm1'
            'pm1_0_mass_concentration'
          when 'pm2_5'
            'pm2_5_mass_concentration'
          when 'pm4'
            'pm4_mass_concentration'
          when 'pm10'
            'pm10_0_mass_concentration'
          else
            key
          end
        end
      end
      # rubocop:enable Metrics/MethodLength

      def value_reported_at
        return if value['published_at'].blank?

        Time.zone.parse(value['published_at']).utc
      end
    end
  end
end
