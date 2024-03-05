# frozen_string_literal: true

require 'swagger_helper'

describe 'Widget Current Data API V1' do
  path '/api/v1/widgets/{widget_id}/current_data' do
    get 'show widget current data' do
      tags 'Widget Current Data'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :locale, in: :query, schema: { type: :string, enum: I18n.available_locales }, required: false
      parameter name: :widget_id, in: :path, type: :integer

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
        end

        run_test!
      end
    end
  end
end
