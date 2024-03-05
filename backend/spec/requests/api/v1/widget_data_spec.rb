# frozen_string_literal: true

require 'swagger_helper'

describe 'Widget Data API V1' do
  path '/api/v1/widgets/{widget_id}/data' do
    get 'list widget data' do
      tags 'Widget Data'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :locale, in: :query, schema: { type: :string, enum: I18n.available_locales }, required: false
      parameter name: :widget_id, in: :path, type: :integer
      parameter name: :from, in: :query, type: :string, format: :date_time, required: false,
                example: '2020-01-01T00:00:00Z'
      parameter name: :to, in: :query, type: :string, format: :date_time, required: false,
                example: '2020-01-01T00:00:00Z'

      response 200, 'successful' do
        let(:school_integration) { create(:school_integration) }
        let(:widget) { create(:widget, data_source: school_integration) }
        let(:widget_id) { widget.id }

        before do
          create(:school_integration_sync,
                 school_integration:,
                 reported_at: Time.zone.now.utc.iso8601,
                 data: {
                   waste_in_g: 1,
                   waste_in_g_per_person: 1,
                   date: Time.zone.now.utc.iso8601
                 })

          # create assoc_data
          create(:school_integration_sync,
                 reported_at: Time.zone.now.utc.iso8601,
                 data: {
                   date: Time.zone.now.utc.iso8601,
                   items: %w[item_1 item_2]
                 },
                 data_source_key: 'school_food_menu')
        end

        run_test!
      end
    end
  end
end
