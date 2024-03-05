# frozen_string_literal: true

require 'swagger_helper'

describe 'Sections API V1' do
  path '/api/v1/pages/{page_id}/sections/{id}' do
    get 'show section' do
      tags 'Sections'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :page_id, in: :path, type: :string
      parameter name: :id, in: :path, type: :string
      parameter name: :locale, in: :query, schema: { type: :string, enum: I18n.available_locales }, required: false

      response 200, 'successful' do
        let(:page) { create(:page) }
        let(:page_id) { page.id }
        let(:section) { create(:section, page:) }
        let(:id) { section.id }

        before do
          create(:widget, section:)
        end

        run_test!
      end
    end
  end
end
