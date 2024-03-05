# frozen_string_literal: true

module Workspace
  class AutoConfigSchoolHomePageSensorWidget < Service
    def initialize(school, sensor)
      @school = school
      @sensor = sensor
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/CyclomaticComplexity
    def call
      sections_ids = sensor.sections.pluck(:id)

      ActiveRecord::Base.transaction do
        case sensor.device
        when 'yosensi_agri_box'
          YosensiAgriBox.call(school, sensor)
        when 'decentlab_dl_pm'
          DecentlabDlPm.call(school, sensor)
        when 'synetica_enlink'
          SyneticaEnlink.call(school, sensor)
        when 'elsys_ers_sound'
          ElsysErsSound.call(school, sensor)
        when 'elsys_ers_co2'
          ElsysErsCo2.call(school, sensor)
        end

        Section.where(id: sections_ids).wo_widgets.each(&:destroy!)

        sensor.widgets.joins(:school).where.not(schools: { id: school.id }).each do |widget|
          widget.section.destroy! if widget.section.widgets.count == 1
          widget.destroy!
        end

        data!(school_home_page)
      end
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/CyclomaticComplexity

    private

    attr_reader :school, :sensor

    def school_home_page
      @school_home_page ||= Pages.find_or_create_page(school_id: school.id, home_page: true)
    end
  end
end
