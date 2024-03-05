# frozen_string_literal: true

require 'swagger_helper'

describe 'School Home Page Overview API V1' do
  path '/api/v1/schools/{school_id}/home_page/overview' do
    get 'show home page overview' do
      tags 'Home Page Overview'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :school_id, in: :path, type: :integer
      parameter name: :locale, in: :query, schema: { type: :string, enum: I18n.available_locales }, required: false

      response 200, 'successful' do
        let(:school) { create(:school) }
        let(:page) { create(:page, school:, home_page: true) }
        let(:school_id) { school.id }

        before do
          school_integration = create(:school_integration, school:)
          create(:widget, page:,
                          section: create(:section, page:, theme: 'food_tracker', sn: 0),
                          data_source: school_integration,
                          data_source_key: 'food_waste_helsingborg', sn: 0)
          create(:school_integration_sync,
                 school_integration:,
                 data: {
                   waste_in_g: 1,
                   waste_in_g_per_person: 1,
                   date: Time.zone.now.utc.iso8601
                 })

          sensor = create(:sensor, school:)
          create(:widget, page:,
                          section: create(:section, page:, theme: 'environmental_monitor', sn: 1),
                          data_source: sensor,
                          data_source_key: 'decentlab_dl_pm/air_temperature', sn: 0)
          create(:sensor_sync,
                 sensor:,
                 data: {
                   temperature: 1
                 })
        end

        run_test!
      end
    end
  end
end
