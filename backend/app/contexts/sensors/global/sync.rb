# frozen_string_literal: true

module Sensors
  module Global
    class Sync < Service
      def initialize(context, payload)
        @context = context
        @payload = payload
      end

      def call
        service = Global::FindOrCreateSensor.call(context)

        if service.success?
          service.data.update!(status: :active)
          SaveSensorSyncJob.perform_later(id: service.data.id, value: payload)

          data!(service.data)
        else
          errors!(service.errors)
        end
      end

      private

      attr_reader :context, :payload
    end
  end
end
