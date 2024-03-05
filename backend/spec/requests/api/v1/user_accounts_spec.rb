# frozen_string_literal: true

require 'swagger_helper'

describe 'User Accounts API V1' do
  path '/api/v1/user_accounts/show' do
    get 'show user account' do
      tags 'User Accounts'
      consumes 'application/json'
      produces 'application/json'

      parameter name: 'Authorization', in: :header, type: :string
      parameter name: :locale, in: :query, schema: { type: :string, enum: I18n.available_locales }, required: false

      response 200, 'successful' do
        let(:user) { create(:user) }
        let(:Authorization) { Accounts.encode_access_token(user) }

        run_test!
      end

      response 401, 'unauthorized' do
        let(:Authorization) { '' }

        run_test!
      end
    end
  end
end
