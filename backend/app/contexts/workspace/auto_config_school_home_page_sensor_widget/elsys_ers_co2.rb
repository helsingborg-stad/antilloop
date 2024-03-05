# frozen_string_literal: true

module Workspace
  class AutoConfigSchoolHomePageSensorWidget
    class ElsysErsCo2 < Service
      def initialize(school, sensor)
        @school = school
        @sensor = sensor
      end

      def call
        return data!(school_home_page) if sensor.connected?(page: school_home_page, section:)

        find_or_create_temperature_widget
        find_or_create_co2_widget

        data!(school_home_page)
      end

      private

      attr_reader :school, :sensor

      def school_home_page
        @school_home_page ||= Pages.find_or_create_page(school_id: school.id, home_page: true)
      end

      def section
        return unless sensor.location

        Section.find_by(page_id: school_home_page.id, name: sensor.location, link: true) ||
          Pages.add_section(
            school_home_page,
            name: sensor.location,
            link: true,
            sn: school_home_page.sections.where(link: true).count
          )
      end

      def find_or_create_temperature_widget
        Pages.find_or_create_widget(
          page: school_home_page,
          data_source: sensor,
          data_source_key: "#{sensor.device}/temperature",
          sn: 1
        ).update!(section:)
      end

      def find_or_create_co2_widget
        Pages.find_or_create_widget(
          page: school_home_page,
          data_source: sensor,
          data_source_key: "#{sensor.device}/co2",
          sn: 2
        ).update!(section:)
      end
    end
  end
end
