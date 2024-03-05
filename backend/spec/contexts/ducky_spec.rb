# frozen_string_literal: true

require 'rails_helper'

describe Ducky, type: :context do
  around do |example|
    Rails.cache.clear

    example.run

    Rails.cache.clear
  end

  # describe '.enabled?' do
  #   after do
  #     ENV['DUCKY_ENABLED'] = '1'
  #   end

  #   context 'when DUCKY_ENABLED is present' do
  #     it 'returns true' do
  #       ENV['DUCKY_ENABLED'] = '1'

  #       expect(described_class.enabled?).to be(true)
  #     end
  #   end

  #   context 'when DUCKY_ENABLED is not present' do
  #     it 'returns false' do
  #       ENV['DUCKY_ENABLED'] = nil

  #       expect(described_class.enabled?).to be(false)
  #     end
  #   end
  # end

  describe '.access_token' do
    around do |example|
      Rails.cache.clear

      example.run

      Rails.cache.clear
    end

    context 'when access_token is present in cache' do
      it 'returns access_token from cache' do
        Rails.cache.write('ducky_access_token', 'cached_access_token', expires_in: 1.hour)

        expect(described_class.access_token).to eq('cached_access_token')
      end
    end

    context 'when access_token in cache is expired' do
      it 'returns access_token from response and writes it to cache' do
        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: '{"access_token":"example_access_token","token_type":"Bearer","expires_in":86400}',
          status: 200
        )

        Rails.cache.write('ducky_access_token', 'access_token', expires_in: -1.hour)

        expect(described_class.access_token).to eq('example_access_token')
        expect(Rails.cache.read('ducky_access_token')).to eq('example_access_token')
      end
    end

    context "when can't get token" do
      it 'returns nil' do
        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: '{"error":"example_error"}',
          status: 400
        )

        expect(described_class.access_token).to be_nil
      end
    end

    context "when can't parse response" do
      it 'returns nil' do
        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: 'example_body',
          status: 200
        )

        expect(described_class.access_token).to be_nil
      end
    end
  end

  describe '.convert_energy' do
    context 'when successful' do
      it 'converts energy' do
        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: '{"access_token":"example_access_token","token_type":"Bearer","expires_in":86400}', status: 200
        )
        stub_request(:post, "#{Ducky::API_URL}convert/energy").to_return(
          body: '{"electricity": {"co2e": 133.609}}',
          status: 200
        )

        service = described_class.convert_energy({ categories: [{
                                                   amount: 500, category: 'electricity', unit: 'kWh'
                                                 }] })

        expect(service.data).to eq('electricity' => { 'co2e' => 133.609 })
      end
    end

    context 'when unsuccessful' do
      it 'does not convert energy' do
        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: '{"access_token":"example_access_token","token_type":"Bearer","expires_in":86400}',
          status: 200
        )
        stub_request(:post, "#{Ducky::API_URL}convert/energy").to_return(body: '{"status": 400}', status: 400)

        service = described_class.convert_energy({ categories: [{
                                                   amount: 500, category: 'electricity', unit: 'kWh'
                                                 }] })

        expect(service.success?).to be(false)
      end
    end
  end

  describe '.translate_car' do
    context 'when successful' do
      it 'translates kgco2e' do
        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: '{"access_token":"example_access_token","token_type":"Bearer","expires_in":86400}',
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

        expect(described_class.translate_car({ kgco2e: 100 }).data).to eq(
          [
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
          ]
        )
      end
    end

    context 'when unsuccessful' do
      it 'does not translate' do
        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: '{"access_token":"example_access_token","token_type":"Bearer","expires_in":86400}',
          status: 200
        )
        stub_request(:post, "#{Ducky::API_URL}translate/car").to_return(
          body: '{"status": 400}',
          status: 400
        )

        service = described_class.translate_car({ kgco2e: 100 })

        expect(service.success?).to be(false)
      end
    end
  end

  describe '.translate_energy' do
    context 'when successful' do
      it 'translates kgco2e' do
        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: '{"access_token":"example_access_token","token_type":"Bearer","expires_in":86400}',
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

        expect(described_class.translate_energy({ kgco2e: 100 }).data).to eq(
          [
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
          ]
        )
      end
    end

    context 'when unsuccessful' do
      it 'does not translate' do
        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: '{"access_token":"example_access_token","token_type":"Bearer","expires_in":86400}',
          status: 200
        )
        stub_request(:post, "#{Ducky::API_URL}translate/energy").to_return(
          body: '{"status": 400}',
          status: 400
        )

        service = described_class.translate_energy({ kgco2e: 100 })

        expect(service.success?).to be(false)
      end
    end
  end

  describe '.translate_plane' do
    context 'when successful' do
      it 'translates kgco2e' do
        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: '{"access_token":"example_access_token","token_type":"Bearer","expires_in":86400}',
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

        expect(described_class.translate_plane({ kgco2e: 100 }).data).to eq(
          [
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
          ]
        )
      end
    end

    context 'when unsuccessful' do
      it 'does not translate' do
        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: '{"access_token":"example_access_token","token_type":"Bearer","expires_in":86400}',
          status: 200
        )
        stub_request(:post, "#{Ducky::API_URL}translate/plane").to_return(
          body: '{"status": 400}',
          status: 400
        )

        service = described_class.translate_plane({ kgco2e: 100 })

        expect(service.success?).to be(false)
      end
    end
  end

  describe '.translate_tree' do
    context 'when successful' do
      it 'translates kgco2e' do
        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: '{"access_token":"example_access_token","token_type":"Bearer","expires_in":86400}',
          status: 200
        )
        stub_request(:post, "#{Ducky::API_URL}translate/tree").to_return(
          body: '{"value":2040.816326530612,"unit":"m2 per year"}',
          status: 200
        )

        expect(described_class.translate_tree({ kgco2e: 100 }).data).to eq({ 'value' => 2040.816326530612,
                                                                             'unit' => 'm2 per year' })
      end
    end

    context 'when unsuccessful' do
      it 'does not translate' do
        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: '{"access_token":"example_access_token","token_type":"Bearer","expires_in":86400}',
          status: 200
        )
        stub_request(:post, "#{Ducky::API_URL}translate/tree").to_return(
          body: '{"status": 400}',
          status: 400
        )

        service = described_class.translate_tree({ kgco2e: 100 })

        expect(service.success?).to be(false)
      end
    end
  end

  describe '.sync' do
    context 'when successful' do
      it 'syncs' do
        school_integration_sync = create(:school_integration_sync, data_source_key: 'oresundskraft', status: 'success',
                                                                   data: { kwh: 100 })

        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: '{"access_token":"example_access_token","token_type":"Bearer","expires_in":86400}', status: 200
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

        service = described_class.sync(school_integration_sync)

        expect(service.data).to eq(
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
                  'unit' => 'km',
                  'destinationA' => 'London',
                  'destinationB' => 'Paris',
                  'vehicle' => 'gasoline_car'
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
        )
      end
    end

    context 'when no kwh' do
      it 'does not sync' do
        school_integration_sync = create(:school_integration_sync, data_source_key: 'oresundskraft', status: 'success',
                                                                   data: {})

        service = described_class.sync(school_integration_sync)

        expect(service.success?).to be(false)
      end
    end

    context 'when no kgco2e' do
      it 'does not sync' do
        school_integration_sync = create(:school_integration_sync, data_source_key: 'oresundskraft', status: 'success',
                                                                   data: { kwh: 100 })
        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: '{"access_token":"example_access_token","token_type":"Bearer","expires_in":86400}',
          status: 200
        )
        stub_request(:post, "#{Ducky::API_URL}convert/energy").to_return(body: '{"status": 400}', status: 400)

        service = described_class.sync(school_integration_sync)

        expect(service.success?).to be(false)
      end
    end

    context 'when no translate_car etc.' do
      it 'syncs' do
        school_integration_sync = create(:school_integration_sync, data_source_key: 'oresundskraft', status: 'success',
                                                                   data: { kwh: 100 })
        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: '{"access_token":"example_access_token","token_type":"Bearer","expires_in":86400}',
          status: 200
        )
        stub_request(:post, "#{Ducky::API_URL}convert/energy").to_return(
          body: '{"electricity": {"co2e": 133.609}}',
          status: 200
        )
        stub_request(:post, "#{Ducky::API_URL}translate/car").to_return(
          body: '{"status": 400}',
          status: 400
        )
        stub_request(:post, "#{Ducky::API_URL}translate/energy").to_return(
          body: '{"status": 400}',
          status: 400
        )
        stub_request(:post, "#{Ducky::API_URL}translate/plane").to_return(
          body: '{"status": 400}',
          status: 400
        )
        stub_request(:post, "#{Ducky::API_URL}translate/tree").to_return(
          body: '{"status": 400}',
          status: 400
        )

        service = described_class.sync(school_integration_sync)

        expect(service.success?).to be(true)
        expect(service.data).to eq({
                                     'convert' => { 'energy' => { 'electricity' => { 'co2e' => 133.609 } } },
                                     'translate' => { 'car' => nil, 'energy' => nil, 'plane' => nil, 'tree' => nil }
                                   })
      end
    end

    context 'when unsuccessful' do
      it 'does not sync' do
        school_integration_sync = create(:school_integration_sync, data_source_key: 'oresundskraft', status: 'success',
                                                                   data: { kwh: 100 })
        stub_request(:post, Ducky::OAUTH_URL).to_return(
          body: '{"error":"example_error"}',
          status: 400
        )

        service = described_class.sync(school_integration_sync)

        expect(service.success?).to be(false)
      end
    end
  end

  describe '.schedule_sync' do
    let(:school_integration_sync) do
      create(:school_integration_sync, data_source_key: 'oresundskraft', status: 'success', data: { kwh: 100 })
    end

    after do
      ENV['DUCKY_ENABLED'] = '1'
    end

    context 'when enabled' do
      it 'schedules sync' do
        expect do
          described_class.schedule_sync(school_integration_sync)
        end.to have_enqueued_job(described_class::SyncJob)
          .with(school_integration_sync_id: school_integration_sync.id)
      end
    end

    # context 'when not enabled' do
    #   it 'does not schedule sync' do
    #     ENV['DUCKY_ENABLED'] = nil

    #     expect do
    #       described_class.schedule_sync(school_integration_sync)
    #     end.not_to have_enqueued_job(described_class::SyncJob)
    #       .with(school_integration_sync_id: school_integration_sync.id)
    #   end
    # end
  end
end
