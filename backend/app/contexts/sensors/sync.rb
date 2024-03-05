# frozen_string_literal: true

module Sensors
  class Sync < Service
    class SyncPayloadInvalidError < StandardError; end

    def initialize(school, payload)
      @school = school
      @payload = payload
    end

    # rubocop:disable Metrics/MethodLength
    def call
      raise SyncPayloadInvalidError, form.errors.messages unless form.validate(payload)

      if find_or_create_sensor.success?
        update_sensor_status!
        schedule_sync

        data!(sensor)
      else
        errors!(find_or_create_sensor.errors)
      end
    rescue SyncPayloadInvalidError => e
      Sentry.capture_message(e.message, level: :warning)

      errors!(form.errors)
    end
    # rubocop:enable Metrics/MethodLength

    private

    attr_reader :school, :payload

    def form
      @form ||= SyncPayloadForm.new(sync_payload)
    end

    def find_or_create_sensor
      @find_or_create_sensor ||= Sensors.find_or_create_sensor(school, sync_payload.sensor_hash)
    end

    def sync_payload
      @sync_payload ||= SyncPayload.new(payload)
    end

    def sensor
      @sensor ||= find_or_create_sensor.data
    end

    def update_sensor_status!
      sensor.update!(status: :active)
    end

    def schedule_sync
      SaveSensorSyncJob.perform_later(id: sensor.id, value: sync_payload.value)
    end
  end
end
