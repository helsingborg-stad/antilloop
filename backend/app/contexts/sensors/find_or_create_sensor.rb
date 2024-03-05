# frozen_string_literal: true

module Sensors
  class FindOrCreateSensor < Service
    include Wisper::Publisher

    def initialize(school, params)
      @school = school
      @params = params
    end

    def call
      if sensor.present?
        sensor.update!(name: params[:name], location: params[:location])

        broadcast(:sensor_updated, school_id: school.id, sensor_id: sensor.id)

        return data!(sensor)
      end

      return errors!(form.errors) unless form.validate(params)

      form.sync
      form.model.save!

      broadcast(:sensor_created, school_id: school.id, sensor_id: form.model.id)

      data!(form.model)
    end

    private

    attr_reader :school, :params

    def sensor
      @sensor ||= Sensors.get_school_sensor_by_external_id(school, external_id:)
    end

    def form
      @form ||= SensorForm.new(Sensor.new(school:))
    end

    def external_id
      params[:external_id]
    end
  end
end
