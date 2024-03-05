# frozen_string_literal: true

module Workspace
  class AutoConfigSchoolHomePageSensorWidget
    class YosensiAgriBox < Service
      def initialize(school, sensor)
        @school = school
        @sensor = sensor
      end

      def call
        return data!(school_home_page) if sensor.connected?(page: school_home_page, section:)

        Pages.add_widget(
          school_home_page,
          section:,
          data_source: sensor,
          data_source_key: sensor.device,
          sn: section.widgets.count
        )

        data!(school_home_page)
      end

      private

      attr_reader :school, :sensor

      def school_home_page
        @school_home_page ||= Pages.find_or_create_page(school_id: school.id, home_page: true)
      end

      def section
        @section ||=
          Pages.find_or_create_section(
            page_id: school_home_page.id,
            name: 'Plant care',
            theme: 'plant_care',
            sn: 1
          )
      end
    end
  end
end
