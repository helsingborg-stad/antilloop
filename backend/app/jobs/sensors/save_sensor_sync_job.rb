# frozen_string_literal: true

module Sensors
  class SaveSensorSyncJob < ApplicationJob
    queue_as :webhook

    def perform(id:, value:)
      Sensors.save_sensor_sync(Sensors.get_sensor_by_id(id:), value)
    end
  end
end
