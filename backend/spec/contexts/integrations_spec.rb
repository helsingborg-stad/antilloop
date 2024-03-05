# frozen_string_literal: true

require 'rails_helper'

describe Integrations, type: :context do
  describe '.list_integrations' do
    let(:school) { create(:school) }
    let!(:integrations) { create_list(:integration, 5) }

    it 'returns a list of integrations' do
      expect(described_class.list_integrations).to eq(integrations.sort_by(&:name))
    end
  end

  describe '.get_integration_by_id' do
    let(:integration) { create(:integration) }

    it 'returns the integration' do
      expect(described_class.get_integration_by_id(id: integration.id)).to eq(integration)
    end
  end

  describe '.get_school_integration_by_id' do
    let(:school) { create(:school) }
    let(:integration) { create(:integration) }
    let(:school_integration) { create(:school_integration, school:, integration:) }

    it 'returns the school integration' do
      expect(described_class.get_school_integration_by_id(id: school_integration.id)).to eq(school_integration)
    end
  end

  # rubocop:disable RSpec/NestedGroups
  describe '.create_school_integration' do
    describe 'food_waste_helsingborg' do
      let(:school) { create(:school) }
      let(:integration) do
        create(:integration, key: 'food_waste_helsingborg',
                             url: 'https://matsvinn.helsingborg.se/api/v1/matsvinn/hamta',
                             settings: { enhetKod: '' })
      end

      context 'when params are valid' do
        let(:params) do
          {
            'settings' => {
              'enhetKod' => 'enhetKod'
            }
          }
        end

        before do
          date = Time.zone.today - 1.day
          url = "https://matsvinn.helsingborg.se/api/v1/matsvinn/hamta?enhetKod=enhetKod&slutDatum=#{date}&startDatum=#{date}"

          stub_request(:post, url)
            .to_return(body: '{}', status: 200)
        end

        it 'creates the school integration' do
          expect { described_class.create_school_integration(school, integration, params) }
            .to change(SchoolIntegration.active, :count).by(1)
        end

        it 'broadcasts :school_integration_created event' do
          expect do
            described_class.create_school_integration(school, integration, params)
          end.to broadcast(:school_integration_created)
        end

        it 'does not broadcast :school_integration_created event' do
          expect do
            described_class.create_school_integration(school, integration, params, broadcast: false)
          end.not_to broadcast(:school_integration_created)
        end

        it 'verifies the settings' do
          service = described_class.create_school_integration(school, integration, params)

          expect(service.success?).to be(true)
          expect(service.errors).to be_blank
        end
      end

      context 'when params are invalid' do
        let(:params) { {} }

        it 'returns errors' do
          service = described_class.create_school_integration(school, integration, params)

          expect(service.success?).to be(false)
          expect(service.errors).to be_present
        end
      end

      context 'when settings are invalid' do
        let(:params) do
          {
            'settings' => {
              'enhetKod' => 'invalid_enhetKod'
            }
          }
        end

        before do
          date = Time.zone.today - 1.day
          url = "https://matsvinn.helsingborg.se/api/v1/matsvinn/hamta?enhetKod=invalid_enhetKod&slutDatum=#{date}&startDatum=#{date}"

          stub_request(:post, url)
            .to_return(body: '{}', status: 422)
        end

        it 'returns errors' do
          service = described_class.create_school_integration(school, integration, params)

          expect(service.success?).to be(false)
          expect(service.errors).to be_present
        end
      end
    end

    describe 'school_food_menu' do
      let(:school) { create(:school) }
      let(:integration) do
        create(:integration, key: 'school_food_menu',
                             url: 'https://skolmaten.se/api/3/menu',
                             settings: { school: 'string', client: 'string' })
      end

      context 'when params are valid' do
        let(:params) do
          {
            'settings' => { 'school' => 'school', 'client' => 'client' }
          }
        end

        before do
          stub_request(:get, 'https://skolmaten.se/api/3/menu?client=client&limit=3&offset=-1&school=school')
            .to_return(body: '{}', status: 200)
        end

        it 'creates the school integration' do
          expect { described_class.create_school_integration(school, integration, params) }
            .to change(SchoolIntegration, :count).by(1)
        end

        it 'verifies the settings' do
          service = described_class.create_school_integration(school, integration, params)

          expect(service.success?).to be(true)
          expect(service.errors).to be_blank
        end
      end

      context 'when params are invalid' do
        let(:params) { {} }

        it 'returns errors' do
          service = described_class.create_school_integration(school, integration, params)

          expect(service.success?).to be(false)
          expect(service.errors).to be_present
        end
      end

      context 'when settings are invalid' do
        let(:params) do
          {
            'settings' => { 'school' => 'invalid_school', 'client' => 'invalid_client' }
          }
        end

        before do
          stub_request(:get, 'https://skolmaten.se/api/3/menu?client=invalid_client&limit=3&offset=-1&school=invalid_school')
            .to_return(body: '', status: 422)
        end

        it 'returns errors' do
          service = described_class.create_school_integration(school, integration, params)

          expect(service.success?).to be(false)
          expect(service.errors).to be_present
        end
      end
    end

    describe 'oresundskraft' do
      let(:school) { create(:school) }
      let(:integration) do
        create(:integration, key: 'oresundskraft',
                             url: 'https://oows.oresundskraft.se/ConsumptionExternal/api/Consumption/TimeSeries/Customers',
                             settings: {
                               'Ocp-Apim-Subscription-Key' => 'string',
                               'customerNumber' => 'string',
                               'meteringPoint' => 'string'
                             })
      end

      context 'when params are valid' do
        let(:params) do
          {
            'settings' => {
              'Ocp-Apim-Subscription-Key' => 'Ocp-Apim-Subscription-Key',
              'customerNumber' => 'customerNumber',
              'meteringPoint' => 'meteringPoint'
            }
          }
        end

        before do
          to_date = Time.zone.today
          from_date = Time.zone.today - 1.day
          url = "https://oows.oresundskraft.se/ConsumptionExternal/api/Consumption/TimeSeries/Customers?toDate=#{to_date}&fromDate=#{from_date}&deliveryCategories=EL&offset=0&maxRows=0&customerNumbers=customerNumber&subsidiary=false"

          stub_request(:get, url)
            .with(headers: { 'Ocp-Apim-Subscription-Key' => 'Ocp-Apim-Subscription-Key', 'api-version' => '2.1' })
            .to_return(body: '{}', status: 200)
        end

        it 'creates the school integration' do
          expect { described_class.create_school_integration(school, integration, params) }
            .to change(SchoolIntegration, :count).by(1)
        end

        it 'verifies the settings' do
          service = described_class.create_school_integration(school, integration, params)

          expect(service.success?).to be(true)
          expect(service.errors).to be_blank
        end
      end

      context 'when params are invalid' do
        let(:params) { {} }

        it 'returns errors' do
          service = described_class.create_school_integration(school, integration, params)

          expect(service.success?).to be(false)
          expect(service.errors).to be_present
        end
      end

      context 'when settings are invalid' do
        let(:params) do
          {
            'settings' => {
              'Ocp-Apim-Subscription-Key' => 'invalid',
              'customerNumber' => 'invalid',
              'meteringPoint' => 'invalid'
            }
          }
        end

        before do
          to_date = Time.zone.today
          from_date = Time.zone.today - 1.day
          url = "https://oows.oresundskraft.se/ConsumptionExternal/api/Consumption/TimeSeries/Customers?toDate=#{to_date}&fromDate=#{from_date}&deliveryCategories=EL&offset=0&maxRows=0&customerNumbers=invalid&subsidiary=false"

          stub_request(:get, url)
            .with(headers: { 'Ocp-Apim-Subscription-Key' => 'invalid', 'api-version' => '2.1' })
            .to_return(body: '{}', status: 422)
        end

        it 'returns errors' do
          service = described_class.create_school_integration(school, integration, params)

          expect(service.success?).to be(false)
          expect(service.errors).to be_present
        end
      end
    end

    describe 'luma_energy' do
      let(:school) { create(:school) }
      let(:integration) do
        create(:integration, key: 'luma_energy',
                             url: 'https://api.powercloudplatform.com/systems/series/energy',
                             settings: { system_ids: 'string', api_key: 'string' })
      end

      context 'when params are valid' do
        let(:params) do
          {
            'settings' => {
              'system_ids' => 'system_ids',
              'api_key' => 'api_key'
            }
          }
        end

        before do
          from = Time.zone.today - 2.days
          to = Time.zone.today - 1.day
          url = "https://api.powercloudplatform.com/systems/series/energy?from=#{from}&multiple_value_types=true&resolution=day&system_ids=system_ids&to=#{to}"

          stub_request(:get, url)
            .with(headers: { 'Authorization' => 'Api-Key api_key' })
            .to_return(body: '{}', status: 200)
        end

        it 'creates the school integration' do
          expect { described_class.create_school_integration(school, integration, params) }
            .to change(SchoolIntegration, :count).by(1)
        end

        it 'verifies the settings' do
          service = described_class.create_school_integration(school, integration, params)

          expect(service.success?).to be(true)
          expect(service.errors).to be_blank
        end
      end

      context 'when params are invalid' do
        let(:params) { {} }

        it 'returns errors' do
          service = described_class.create_school_integration(school, integration, params)

          expect(service.success?).to be(false)
          expect(service.errors).to be_present
        end
      end

      context 'when settings are invalid' do
        let(:params) do
          {
            'settings' => {
              'system_ids' => 'invalid',
              'api_key' => 'invalid'
            }
          }
        end

        before do
          from = Time.zone.today - 2.days
          to = Time.zone.today - 1.day
          url = "https://api.powercloudplatform.com/systems/series/energy?from=#{from}&multiple_value_types=true&resolution=day&system_ids=invalid&to=#{to}"

          stub_request(:get, url)
            .with(headers: { 'Authorization' => 'Api-Key invalid' })
            .to_return(body: '{}', status: 422)
        end

        it 'returns errors' do
          service = described_class.create_school_integration(school, integration, params)

          expect(service.success?).to be(false)
          expect(service.errors).to be_present
        end
      end
    end

    describe 'weather_helsingborg' do
      let(:school) { create(:school) }
      let(:integration) { create(:integration, key: 'weather_helsingborg', settings: {}) }

      it 'creates the school integration' do
        expect { described_class.create_school_integration(school, integration, {}) }
          .to change(SchoolIntegration, :count).by(1)
      end
    end
  end
  # rubocop:enable RSpec/NestedGroups

  describe '.update_school_integration' do
    context 'when params are valid' do
      let(:school) { create(:school) }
      let(:integration) do
        create(:integration, key: 'food_waste_helsingborg',
                             url: 'https://matsvinn.helsingborg.se/api/v1/matsvinn/hamta',
                             settings: { enhetKod: '' })
      end
      let(:school_integration) { create(:school_integration, school:, integration:) }
      let(:params) do
        {
          'status' => 'active',
          'settings' => {
            'enhetKod' => 'enhetKod'
          }
        }
      end

      before do
        date = Time.zone.today - 1.day
        url = "https://matsvinn.helsingborg.se/api/v1/matsvinn/hamta?enhetKod=enhetKod&slutDatum=#{date}&startDatum=#{date}"

        stub_request(:post, url)
          .to_return(body: '{}', status: 200)
      end

      it 'updates the school integration' do
        service = described_class.update_school_integration(school_integration, params)

        expect(service.success?).to be(true)
        expect(service.data.settings).to eq(params['settings'])
      end
    end

    context 'when params are invalid' do
      let(:school) { create(:school) }
      let(:integration) { create(:integration, settings: { api_key: '' }) }
      let(:school_integration) { create(:school_integration, school:, integration:) }
      let(:params) { {} }

      it 'returns errors' do
        service = described_class.update_school_integration(school_integration, params)

        expect(service.success?).to be(false)
        expect(service.errors).to be_present
      end
    end

    context 'when status is inactive' do
      let(:school) { create(:school) }
      let(:integration) do
        create(:integration, key: 'food_waste_helsingborg',
                             url: 'https://matsvinn.helsingborg.se/api/v1/matsvinn/hamta',
                             settings: { enhetKod: '' })
      end
      let(:school_integration) { create(:school_integration, school:, integration:) }
      let(:params) do
        {
          'status' => 'inactive',
          'settings' => {
            'enhetKod' => 'enhetKod'
          }
        }
      end
      let(:integrations_request) { instance_double(Integrations::Req, call: true) }

      before do
        allow(Integrations::Req).to receive(:call) { integrations_request }
      end

      it 'updates the school integration' do
        service = described_class.update_school_integration(school_integration, params)

        expect(service.success?).to be(true)
        expect(service.data.settings).to eq(params['settings'])
        expect(integrations_request).not_to have_received(:call)
      end
    end
  end

  describe '.delete_school_integration' do
    let(:school) { create(:school) }
    let(:integration) { create(:integration) }
    let!(:school_integration) { create(:school_integration, school:, integration:) }

    it 'deletes the school integration' do
      expect { described_class.delete_school_integration(school_integration) }
        .to change(SchoolIntegration, :count).by(-1)
    end
  end

  describe '.disable_school_integration' do
    let(:school_integration) { create(:school_integration, status: 'active') }

    it 'disables the school integration' do
      described_class.disable_school_integration(school_integration)

      expect(school_integration.reload.status).to eq('inactive')
    end
  end

  describe '.enable_school_integration' do
    let(:school_integration) { create(:school_integration, status: 'inactive') }

    it 'enables the school integration' do
      described_class.enable_school_integration(school_integration)

      expect(school_integration.reload.status).to eq('active')
    end
  end
end
