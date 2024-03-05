# frozen_string_literal: true

module Sensors
  module_function

  def list_sensors(school) = school.sensors

  def get_school_sensor_by_external_id(school, external_id:)
    school.sensors.find_by(external_id:)
  end

  def get_sensor_by_external_id(external_id:)
    Sensor.find_by(external_id:)
  end

  def get_sensor_by_id(id:) = Sensor.find(id)

  def find_or_create_sensor(school, params = {})
    service = FindOrCreateSensor.call(school, params)

    yield(service) if block_given?

    service
  end

  def sync(school, payload)
    service = Sync.call(school, payload)

    yield(service) if block_given?

    service
  end

  def save_sensor_sync(sensor, value)
    service = SaveSensorSync.call(sensor, value)

    yield(service) if block_given?

    service
  end

  def global_sensor_sync(context, payload)
    service = Global::Sync.call(context, payload)

    yield(service) if block_given?

    service
  end
end
