# frozen_string_literal: true

class SchoolHomePageSubscription
  class << self
    def school_integration_created(payload)
      school = Schools.get_school(payload[:school_id])
      school_integration = Integrations.get_school_integration_by_id(id: payload[:school_integration_id])

      Workspace.auto_config_school_home_page_school_integration_widget(school, school_integration)
    end

    def sensor_created(payload)
      school = Schools.get_school(payload[:school_id])
      sensor = Sensors.get_sensor_by_id(id: payload[:sensor_id])

      Workspace.auto_config_school_home_page_sensor_widget(school, sensor)
    end

    def sensor_updated(payload)
      school = Schools.get_school(payload[:school_id])
      sensor = Sensors.get_sensor_by_id(id: payload[:sensor_id])

      Workspace.auto_config_school_home_page_sensor_widget(school, sensor)
    end
  end
end
