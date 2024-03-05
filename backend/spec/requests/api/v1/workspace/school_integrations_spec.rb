# frozen_string_literal: true

require 'swagger_helper'

describe 'Workspace School Integrations API V1' do
  path '/api/v1/workspace/schools/{school_id}/integrations/{integration_id}/school_integrations' do
    post 'create school integration' do
      tags 'Workspace School Integrations'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :school_id, in: :path, type: :string, required: true
      parameter name: :integration_id, in: :path, type: :string, required: true
      parameter name: :locale, in: :query, schema: { type: :string, enum: I18n.available_locales }, required: false
      parameter name: 'Authorization', in: :header, type: :string
      parameter name: :school_integration, in: :body, schema: {
        type: :object,
        properties: {
          status: { type: :string, enum: %w[active inactive] },
          settings: { type: :object }
        }
      }

      before do
        date = Time.zone.today - 1.day
        url = "https://matsvinn.helsingborg.se/api/v1/matsvinn/hamta?enhetKod=enhetKod&slutDatum=#{date}&startDatum=#{date}"

        stub_request(:post, url)
          .to_return(body: '{}', status: 200)
      end

      response 200, 'successful' do
        let(:school) { create(:school) }
        let(:user) { create(:user, school:) }
        let(:Authorization) { Accounts.encode_access_token(user) }
        let(:school_id) { school.id }
        let(:integration) do
          create(:integration, key: 'food_waste_helsingborg',
                               url: 'https://matsvinn.helsingborg.se/api/v1/matsvinn/hamta',
                               settings: { enhetKod: '' })
        end
        let(:integration_id) { integration.id }
        let(:school_integration) do
          {
            'status' => 'active',
            'settings' => {
              'enhetKod' => 'enhetKod'
            }
          }
        end

        after do |spec|
          spec.metadata[:operation][:request_examples] ||= []

          example = {
            value: JSON.parse(request.body.string, symbolize_names: true),
            name: 'request_example_1',
            summary: 'A request example'
          }

          spec.metadata[:operation][:request_examples] << example
        end

        run_test!
      end

      response 401, 'unauthorized' do
        let(:school_id) { create(:school).id }
        let(:integration) do
          create(:integration, key: 'food_waste_helsingborg',
                               url: 'https://matsvinn.helsingborg.se/api/v1/matsvinn/hamta',
                               settings: { enhetKod: '' })
        end
        let(:integration_id) { integration.id }
        let(:Authorization) { '' }
        let(:school_integration) do
          {
            'status' => 'active',
            'settings' => {
              'enhetKod' => 'enhetKod'
            }
          }
        end

        run_test!
      end

      response 403, 'forbidden' do
        let(:school) { create(:school) }
        let(:user) { create(:user, school:) }
        let(:school_id) { create(:school).id }
        let(:integration) do
          create(:integration, key: 'food_waste_helsingborg',
                               url: 'https://matsvinn.helsingborg.se/api/v1/matsvinn/hamta',
                               settings: { enhetKod: '' })
        end
        let(:integration_id) { integration.id }
        let(:Authorization) { Accounts.encode_access_token(user) }
        let(:school_integration) do
          {
            'status' => 'active',
            'settings' => {
              'enhetKod' => 'enhetKod'
            }
          }
        end

        run_test!
      end
    end
  end

  path '/api/v1/workspace/school_integrations/{id}' do
    put 'update school integration' do
      tags 'Workspace School Integrations'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :id, in: :path, type: :string, required: true
      parameter name: :locale, in: :query, schema: { type: :string, enum: I18n.available_locales }, required: false
      parameter name: 'Authorization', in: :header, type: :string
      parameter name: :school_integration, in: :body, schema: {
        type: :object,
        properties: {
          status: { type: :string, enum: %w[active inactive] },
          settings: { type: :object }
        }
      }

      before do
        date = Time.zone.today - 1.day
        url = "https://matsvinn.helsingborg.se/api/v1/matsvinn/hamta?enhetKod=enhetKod&slutDatum=#{date}&startDatum=#{date}"

        stub_request(:post, url)
          .to_return(body: '{}', status: 200)
      end

      response 200, 'successful' do
        let(:school) { create(:school) }
        let(:user) { create(:user, school:) }
        let(:Authorization) { Accounts.encode_access_token(user) }
        let(:integration) do
          create(:integration, key: 'food_waste_helsingborg',
                               url: 'https://matsvinn.helsingborg.se/api/v1/matsvinn/hamta',
                               settings: { enhetKod: '' })
        end
        let(:id) { create(:school_integration, school:, integration:).id }
        let(:school_integration) do
          {
            'status' => 'active',
            'settings' => {
              'enhetKod' => 'enhetKod'
            }
          }
        end

        run_test!
      end

      response 401, 'unauthorized' do
        let(:id) { create(:school_integration).id }
        let(:Authorization) { '' }
        let(:school_integration) do
          {
            'status' => 'active',
            'settings' => {
              'enhetKod' => 'enhetKod'
            }
          }
        end

        run_test!
      end

      response 403, 'forbidden' do
        let(:school) { create(:school) }
        let(:user) { create(:user, school:) }
        let(:id) { create(:school_integration).id }
        let(:Authorization) { Accounts.encode_access_token(user) }
        let(:school_integration) do
          {
            'status' => 'active',
            'settings' => {
              'enhetKod' => 'enhetKod'
            }
          }
        end

        run_test!
      end
    end

    delete 'delete school integration' do
      tags 'Workspace School Integrations'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :id, in: :path, type: :string, required: true
      parameter name: :locale, in: :query, schema: { type: :string, enum: I18n.available_locales }, required: false
      parameter name: 'Authorization', in: :header, type: :string

      response 200, 'successful' do
        let(:school) { create(:school) }
        let(:user) { create(:user, school:) }
        let(:Authorization) { Accounts.encode_access_token(user) }
        let(:school_integration) { create(:school_integration, school:) }
        let(:id) { school_integration.id }

        run_test!
      end

      response 401, 'unauthorized' do
        let(:school_integration) { create(:school_integration) }
        let(:id) { school_integration.id }
        let(:Authorization) { '' }

        run_test!
      end

      response 403, 'forbidden' do
        let(:school) { create(:school) }
        let(:user) { create(:user, school:) }
        let(:school_integration) { create(:school_integration) }
        let(:id) { school_integration.id }
        let(:Authorization) { Accounts.encode_access_token(user) }

        run_test!
      end
    end
  end
end
