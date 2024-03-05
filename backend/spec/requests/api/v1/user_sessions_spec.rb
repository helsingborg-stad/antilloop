# frozen_string_literal: true

require 'swagger_helper'

describe 'User Sessions API V1' do
  path '/api/v1/user_accounts/sign_in' do
    post 'create user session' do
      tags 'User Sessions'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :locale, in: :query, schema: { type: :string, enum: I18n.available_locales }, required: false
      parameter name: :user_session, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string },
          name: { type: :string }
        },
        required: %w[email]
      }

      response 200, 'successful' do
        let(:user) { create(:user) }
        let(:user_session) { { email: user.email } }

        run_test!
      end

      response 422, 'unprocessable entity' do
        let(:user_session) { { email: Faker::Internet.email } }

        run_test!
      end
    end
  end
end
