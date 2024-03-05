# frozen_string_literal: true

module Workspace
  module_function

  def auto_config_school_home_page_sensor_widget(school, sensor)
    AutoConfigSchoolHomePageSensorWidget.call(school, sensor)
  end

  def auto_config_school_home_page_school_integration_widget(school, school_integration)
    AutoConfigSchoolHomePageSchoolIntegrationWidget.call(school, school_integration)
  end
end
