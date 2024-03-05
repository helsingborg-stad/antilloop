# frozen_string_literal: true

require 'swagger_helper'

describe 'Widget Data Likes API V1' do
  path '/api/v1/widgets/{widget_id}/data/{data_id}/likes' do
    post 'create like' do
      tags 'Likes'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :widget_id, in: :path, type: :string
      parameter name: :data_id, in: :path, type: :string
      parameter name: :locale, in: :query, schema: { type: :string, enum: I18n.available_locales }, required: false

      response 201, 'successful' do
        let(:school_integration) { create(:school_integration) }
        let(:widget) { create(:widget, data_source: school_integration) }
        let(:widget_id) { widget.id }
        let(:data) { create(:school_integration_sync, school_integration:) }
        let(:data_id) { data.id }

        run_test!
      end
    end
  end
end
