# frozen_string_literal: true

module Workspace
  class AutoConfigSchoolHomePageSensorWidget
    class SyneticaEnlink < Service
      def initialize(school, sensor)
        @school = school
        @sensor = sensor
      end

      def call
        return data!(school_home_page) if sensor.connected?(page: school_home_page, section:)

        add_air_temperature_widget
        add_pm2_5_mass_concentration_widget
        add_pm10_0_mass_concentration_widget

        data!(school_home_page)
      end

      private

      attr_reader :school, :sensor

      def school_home_page
        @school_home_page ||= Pages.find_or_create_page(school_id: school.id, home_page: true)
      end

      def add_air_temperature_widget
        Pages.add_widget(
          school_home_page,
          section:,
          data_source: sensor,
          data_source_key: "#{sensor.device}/air_temperature",
          sn: section.widgets.count
        )
      end

      def add_pm2_5_mass_concentration_widget
        Pages.add_widget(
          school_home_page,
          section:,
          data_source: sensor,
          data_source_key: "#{sensor.device}/pm2_5_mass_concentration",
          sn: section.widgets.count
        )
      end

      def add_pm10_0_mass_concentration_widget
        Pages.add_widget(
          school_home_page,
          section:,
          data_source: sensor,
          data_source_key: "#{sensor.device}/pm10_0_mass_concentration",
          sn: section.widgets.count
        )
      end

      def section
        @section ||=
          Pages.find_or_create_section(
            page_id: school_home_page.id,
            name: 'Environmental monitor',
            theme: 'environmental_monitor',
            sn: 2
          )
      end
    end
  end
end
