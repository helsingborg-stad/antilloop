# frozen_string_literal: true

module Sensors
  module SyneticaEnlink
    class SensorSyncValue < Sensors::SensorSyncValue
      # rubocop:disable Metrics/MethodLength
      def data
        super.transform_keys do |key|
          case key
          when 'pm1_ppm'
            'pm1_0_mass_concentration'
          when 'pm2_5_ppm'
            'pm2_5_mass_concentration'
          when 'pm4_ppm'
            'pm4_mass_concentration'
          when 'pm10_ppm'
            'pm10_0_mass_concentration'
          when 'temperature'
            'air_temperature'
          else
            key
          end
        end
      end
      # rubocop:enable Metrics/MethodLength
    end
  end
end
