# frozen_string_literal: true

require 'rails_helper'

describe Ducky::SyncJob do
  describe '#perform' do
    subject(:job) { described_class.perform_later(school_integration_sync_id: school_integration_sync.id) }

    let!(:school_integration_sync) do
      create(:school_integration_sync, data_source_key: 'oresundskraft', status: 'success', data: { kwh: 100 })
    end

    around do |example|
      Rails.cache.clear

      example.run

      Rails.cache.clear
    end

    it 'enqueues job' do
      expect do
        job
      end.to have_enqueued_job(described_class).with(school_integration_sync_id: school_integration_sync.id)
                                               .on_queue('ducky')
    end

    it 'performs sync' do
      stub_request(:post, Ducky::OAUTH_URL).to_return(
        body: '{"access_token":"example_access_token","token_type":"Bearer","expires_in":86400}',
        status: 200
      )
      stub_request(:post, "#{Ducky::API_URL}convert/energy").to_return(
        body: '{"electricity": {"co2e": 133.609}}',
        status: 200
      )
      stub_request(:post, "#{Ducky::API_URL}translate/car").to_return(
        body: '[
  {
    "value":456.62100456621005,"unit":"km",
    "translation":{"actualDistance":403,"unit":"km","destinationA":"London",
      "destinationB":"Glasgow","vehicle":"gasoline_car"}
  },
  {
    "value":456.62100456621005,"unit":"km",
    "translation":{"actualDistance":464,"unit":"km","destinationA":"London",
      "destinationB":"Paris","vehicle":"gasoline_car"}
  }
            ]',
        status: 200
      )
      stub_request(:post, "#{Ducky::API_URL}translate/energy").to_return(
        body: '[
  {
    "value":318.47133757961785,"unit":"kWh",
    "translation":{"applianceUnit":"years","quantity":1.04,"appliance":"bærbar PC"}
  },
  {
    "value":318.47133757961785,"unit":"kWh",
    "translation":{"applianceUnit":"months","quantity":2.72,"appliance":"stasjonær PC"}
  },
  {
    "value":318.47133757961785,"unit":"kWh",
    "translation":{"applianceUnit":"days","quantity":6.42,"appliance":"husholdnings energiforbruk"}
  }
            ]',
        status: 200
      )
      stub_request(:post, "#{Ducky::API_URL}translate/plane").to_return(
        body: '[
  {
    "value":352.11267605633805,"unit":"km",
    "translation":{"actualDistance":391,"unit":"km","destinationA":"Oslo",
      "destinationB":"Trondheim","flightType":"local_flight"}
  },
  {
    "value":352.11267605633805,"unit":"km",
    "translation":{"actualDistance":416,"unit":"km","destinationA":"Oslo",
      "destinationB":"Stockholm","flightType":"local_flight"}
  },
  {
    "value":352.11267605633805,"unit":"km",
    "translation":{"actualDistance":410,"unit":"km","destinationA":"Paris",
      "destinationB":"Geneva","flightType":"local_flight"}
  }
              ]',
        status: 200
      )
      stub_request(:post, "#{Ducky::API_URL}translate/tree").to_return(
        body: '{"value":2040.816326530612,"unit":"m2 per year"}',
        status: 200
      )

      described_class.perform_now(school_integration_sync_id: school_integration_sync.id)

      expect(school_integration_sync.reload.ducky).to eq(
        {
          'convert' => {
            'energy' => { 'electricity' => { 'co2e' => 133.609 } }
          },
          'translate' => {
            'car' => [
              {
                'value' => 456.62100456621005,
                'unit' => 'km',
                'translation' => {
                  'actualDistance' => 403,
                  'unit' => 'km',
                  'destinationA' => 'London',
                  'destinationB' => 'Glasgow',
                  'vehicle' => 'gasoline_car'
                }
              },
              {
                'value' => 456.62100456621005,
                'unit' => 'km',
                'translation' => {
                  'actualDistance' => 464,
                  'unit' => 'km', 'destinationA' =>
                  'London', 'destinationB' =>
                  'Paris', 'vehicle' =>
                  'gasoline_car'
                }
              }
            ],
            'energy' => [
              {
                'value' => 318.47133757961785,
                'unit' => 'kWh',

                'translation' => {
                  'applianceUnit' => 'years',
                  'quantity' => 1.04,
                  'appliance' => 'bærbar PC'
                }
              },
              {
                'value' => 318.47133757961785,
                'unit' => 'kWh',

                'translation' => {
                  'applianceUnit' => 'months',
                  'quantity' => 2.72,
                  'appliance' => 'stasjonær PC'
                }
              },
              {
                'value' => 318.47133757961785,
                'unit' => 'kWh',

                'translation' => {
                  'applianceUnit' => 'days',
                  'quantity' => 6.42,
                  'appliance' => 'husholdnings energiforbruk'
                }
              }
            ],
            'plane' => [
              {
                'value' => 352.11267605633805,
                'unit' => 'km',

                'translation' => {
                  'actualDistance' => 391,
                  'unit' => 'km',
                  'destinationA' => 'Oslo',
                  'destinationB' => 'Trondheim',
                  'flightType' => 'local_flight'
                }
              },
              {
                'value' => 352.11267605633805,
                'unit' => 'km',

                'translation' => {
                  'actualDistance' => 416,
                  'unit' => 'km',
                  'destinationA' => 'Oslo',
                  'destinationB' => 'Stockholm',
                  'flightType' => 'local_flight'
                }
              },
              {
                'value' => 352.11267605633805,
                'unit' => 'km',

                'translation' => {
                  'actualDistance' => 410,
                  'unit' => 'km',
                  'destinationA' => 'Paris',
                  'destinationB' => 'Geneva',
                  'flightType' => 'local_flight'
                }
              }
            ],
            'tree' => {
              'value' => 2040.816326530612,
              'unit' => 'm2 per year'
            }
          }
        }
      )
    end

    it 'raises ActiveRecord::RecordNotFound' do
      expect do
        described_class.perform_now(school_integration_sync_id: 0)
      end.to raise_error(ActiveRecord::RecordNotFound)
    end
  end
end
