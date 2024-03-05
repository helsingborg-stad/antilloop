# frozen_string_literal: true

module Sensors
  module Global
    class FindOrCreateSensor < Service
      def initialize(params)
        @params = params
      end

      def call
        if sensor.present?
          sensor.update!(name: params[:name], location: params[:location])

          return data!(sensor)
        end

        return errors!(form.errors) unless form.validate(params)

        form.sync
        form.model.save!

        data!(form.model)
      end

      private

      attr_reader :params

      def sensor
        @sensor ||= Sensors.get_sensor_by_external_id(external_id:)
      end

      def form
        @form ||= SensorForm.new(Sensor.new)
      end

      def external_id
        params[:external_id]
      end
    end
  end
end
