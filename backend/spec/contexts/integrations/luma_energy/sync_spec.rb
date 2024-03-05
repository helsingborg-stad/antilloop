# frozen_string_literal: true

require 'rails_helper'

describe Integrations::LumaEnergy::Sync, type: :context do
  describe '.call' do
    context 'when success' do
      let(:school_integration) { create(:school_integration) }
      let(:data) do
        {
          'meta' => {
            'system_ids' => ['e858ff61-5588-cd41-7224-80f2e7458607'],
            'value_type' => 'ac_e_pos_tot',
            'resolution' => 'day',
            'from' => '2023-07-24T00:00:00Z',
            'to' => '2023-07-25T00:00:00Z',
            'time_unix' => false,
            'multiple_value_types' => true
          },
          'result' => [
            {
              'system_id' => 'e858ff61-5588-cd41-7224-80f2e7458607',
              'popular_name' => 'Helsingborg - Västra Ramlösa Skola 1 (Helsingborg Stad)',
              'facility_id' => '357ef2c5-d1ac-c8f8-8e44-0d94f32d117e',
              'enabled' => true,
              'registered_at' => '2020-01-10T13:12:40.000Z',
              'system_type' => 'solar',
              'ean' => nil,
              'meta' => {
                'vendor' => nil,
                'pv_area' => nil,
                'internal' => true,
                'start_date' => '2019-12-05T12:00:00+00:00',
                'has_service' => false,
                'cesar_enabled' => false,
                'installed_power' => 32.4,
                'has_production_guarantee' => false
              },
              'description' => nil,
              'data' => [
                {
                  'value_type' => 'i_ac_e_pos_tot',
                  'time_utc' => ['2023-07-24T00:00:00.000Z', '2023-07-25T00:00:00.000Z'],
                  'time_unix' => [1_690_156_800, 1_690_243_200],
                  'absolute' => [129_435_192, 129_435_192],
                  'relative' => [20_016, 0]
                }
              ]
            }
          ]
        }
      end
      let(:sync_req) do
        instance_double(Integrations::LumaEnergy::Req, data:, success?: true)
      end

      before do
        allow(Integrations::LumaEnergy::Req).to receive(:call).with(school_integration).and_return(sync_req)
      end

      it 'creates a sync' do
        expect { described_class.call(school_integration) }.to change { school_integration.syncs.count }.by(1)
      end

      it 'saves the correct data' do
        service = described_class.call(school_integration)

        expect(service.data.data).to eq(
          'kwh' => 20.016000000000002,
          'date' => '2023-07-24T00:00:00Z'
        )
      end

      it 'saves the correct value' do
        service = described_class.call(school_integration)

        expect(service.data.value).to eq(data)
      end

      it 'saves the correct status' do
        service = described_class.call(school_integration)

        expect(service.data.status).to eq('success')
      end

      it 'saves data_source_key' do
        service = described_class.call(school_integration)

        expect(service.data.data_source_key).to eq(school_integration.key)
      end

      it 'saves reported_at' do
        service = described_class.call(school_integration)

        expect(service.data.reported_at).to eq(Time.zone.parse('2023-07-24T00:00:00.000Z').utc)
      end
    end

    context 'when failure' do
      let(:school_integration) { create(:school_integration) }
      let(:data) { 'data' }
      let(:sync_req) do
        instance_double(Integrations::LumaEnergy::Req, data:, success?: false)
      end

      before do
        allow(Integrations::LumaEnergy::Req).to receive(:call).with(school_integration).and_return(sync_req)
      end

      it 'creates a sync' do
        expect { described_class.call(school_integration) }.to change { school_integration.syncs.count }.by(1)
      end

      it 'saves the correct status' do
        service = described_class.call(school_integration)

        expect(service.data.status).to eq('failure')
      end

      it 'save the correct value' do
        service = described_class.call(school_integration)

        expect(service.data.value).to eq(data)
      end

      it 'does not save any data' do
        service = described_class.call(school_integration)

        expect(service.data.data).to eq({})
      end
    end
  end
end
