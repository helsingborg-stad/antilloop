# frozen_string_literal: true

module Workspace
  class AutoConfigSchoolHomePageSchoolIntegrationWidget < Service
    def initialize(school, school_integration)
      @school = school
      @school_integration = school_integration
    end

    def call
      unless SECTION_CONFIG.key?(school_integration.key)
        return errors.add(:base,
                          I18n.t('school_integration.errors.data_source_key_is_not_valid'))
      end

      Pages.add_widget(school_home_page,
                       section:,
                       data_source: school_integration,
                       data_source_key: school_integration.key,
                       **WIDGET_CONFIG[school_integration.key])

      data!(school_home_page)
    end

    private

    attr_reader :school, :school_integration

    SECTION_CONFIG =
      {
        'food_waste_helsingborg' => {
          name: 'Food tracker',
          theme: 'food_tracker',
          sn: 0
        },
        'school_food_menu' => {
          name: 'Food tracker',
          theme: 'food_tracker',
          sn: 0
        },
        'oresundskraft' => {
          name: 'Electricity meter',
          theme: 'electricity_meter',
          sn: 3
        },
        'luma_energy' => {
          name: 'Electricity meter',
          theme: 'electricity_meter',
          sn: 3
        },
        'weather_helsingborg' => {
          name: 'Environmental monitor',
          theme: 'environmental_monitor',
          sn: 2
        },
        'footprint_calculator' => {
          name: 'Footprint calculator',
          theme: 'footprint_calculator',
          school_page: false,
          sn: 4
        }
      }.freeze

    WIDGET_CONFIG =
      {
        'food_waste_helsingborg' => { sn: 0 },
        'school_food_menu' => { sn: 1 },
        'oresundskraft' => { sn: 0 },
        'luma_energy' => { sn: 1 },
        'weather_helsingborg' => { sn: 3 },
        'footprint_calculator' => { sn: 0 }
      }.freeze

    def school_home_page
      @school_home_page ||= Pages.find_or_create_page(school_id: school.id, home_page: true)
    end

    def section
      @section ||= Pages.find_or_create_section(page_id: school_home_page.id, **SECTION_CONFIG[school_integration.key])
    end
  end
end
