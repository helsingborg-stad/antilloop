# frozen_string_literal: true

require 'swagger_helper'

describe 'Schools API V1' do
  path '/api/v1/schools' do
    get 'list schools' do
      tags 'Schools'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :locale, in: :query, schema: { type: :string, enum: I18n.available_locales }, required: false

      response 200, 'successful' do
        before { create(:school, :with_logo) }

        run_test!
      end
    end
  end

  path '/api/v1/schools/{id}' do
    get 'show school' do
      tags 'Schools'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :id, in: :path, type: :string

      response 200, 'successful' do
        let(:id) { create(:school).id }

        run_test!
      end
    end
  end
end
