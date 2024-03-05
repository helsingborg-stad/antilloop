# frozen_string_literal: true

require 'swagger_helper'

describe 'Workspace Schools API V1' do
  path '/api/v1/workspace/schools/{id}' do
    get 'show school' do
      tags 'Workspace Schools'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :id, in: :path, type: :string, required: true
      parameter name: :locale, in: :query, schema: { type: :string, enum: I18n.available_locales }, required: false
      parameter name: 'Authorization', in: :header, type: :string

      response 200, 'successful' do
        let(:school) { create(:school, :with_logo, main_color: '#088DA5') }
        let(:user) { create(:user, school:) }
        let(:Authorization) { Accounts.encode_access_token(user) }
        let(:id) { school.id }

        run_test!
      end

      response 401, 'unauthorized' do
        let(:id) { create(:school).id }
        let(:Authorization) { '' }

        run_test!
      end

      response 403, 'forbidden' do
        let(:school) { create(:school) }
        let(:user) { create(:user, school:) }
        let(:id) { create(:school).id }
        let(:Authorization) { Accounts.encode_access_token(user) }

        run_test!
      end
    end
  end

  path '/api/v1/workspace/schools/{id}' do
    put 'update school' do
      tags 'Workspace Schools'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :id, in: :path, type: :string, required: true
      parameter name: :school, in: :body, schema: {
        type: :object,
        properties: {
          school: {
            type: :object,
            properties: {
              name: { type: :string },
              main_color: { type: :string },
              logo: { type: :string, format: :binary }
            }
          }
        }
      }
      parameter name: :locale, in: :query, schema: { type: :string, enum: I18n.available_locales }, required: false
      parameter name: 'Authorization', in: :header, type: :string

      response 200, 'successful' do
        let(:school_record) { create(:school, :with_logo, main_color: '#088DA5') }
        let(:user) { create(:user, school: school_record) }
        let(:Authorization) { Accounts.encode_access_token(user) }
        let(:id) { school_record.id }
        let(:school) { { name: 'New name', main_color: '#FF0000' } }

        run_test!
      end

      response 401, 'unauthorized' do
        let(:id) { create(:school).id }
        let(:Authorization) { '' }
        let(:school) { { name: 'New name', main_color: '#FF0000' } }

        run_test!
      end

      response 403, 'forbidden' do
        let(:school_record) { create(:school) }
        let(:user) { create(:user, school: school_record) }
        let(:id) { create(:school).id }
        let(:Authorization) { Accounts.encode_access_token(user) }
        let(:school) { { name: 'New name', main_color: '#FF0000' } }

        run_test!
      end
    end
  end
end
