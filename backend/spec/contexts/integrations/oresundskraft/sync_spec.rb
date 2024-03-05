# frozen_string_literal: true

require 'rails_helper'

describe Integrations::Oresundskraft::Sync, type: :context do
  describe '.call' do
    context 'when success' do
      let(:school_integration) { create(:school_integration) }
      let(:data) do
        {
          'date' => '2023-09-25T00:00:00',
          'consumptions' => {
            'customerNumber' => '58095',
            'meteringPoint' => '735999124000977318',
            'installationNumber' => '17953',
            'deliveryCategory' => 'EL',
            'microproduction' => false,
            'settlement' => 'FRB',
            'subscribedEffect' => 0,
            'rateCode' => '80A',
            'reading' => [
              {
                'readingDate' => '2023-09-25T00:00:00',
                'value' => 4.45400,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T01:00:00',
                'value' => 4.48800,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T02:00:00',
                'value' => 4.42600,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T03:00:00',
                'value' => 4.46000,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T04:00:00',
                'value' => 4.48400,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T05:00:00',
                'value' => 4.52600,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T06:00:00',
                'value' => 7.19200,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T07:00:00',
                'value' => 10.21800,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T08:00:00',
                'value' => 6.58800,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T09:00:00',
                'value' => 1.05200,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T10:00:00',
                'value' => 0.03000,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T11:00:00',
                'value' => 0.00000,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T12:00:00',
                'value' => 1.58400,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T13:00:00',
                'value' => 1.43600,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T14:00:00',
                'value' => 0.31000,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T15:00:00',
                'value' => 0.67800,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T16:00:00',
                'value' => 3.78800,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T17:00:00',
                'value' => 6.91000,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T18:00:00',
                'value' => 9.45000,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T19:00:00',
                'value' => 11.36400,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T20:00:00',
                'value' => 10.93200,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T21:00:00',
                'value' => 5.48400,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T22:00:00',
                'value' => 4.47800,
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T23:00:00',
                'value' => 4.45801,
                'status' => 'Processed',
                'unit' => 'kWh'
              }
            ]
          }
        }
      end
      let(:sync_req) do
        instance_double(Integrations::Oresundskraft::Req, data:, success?: true)
      end

      before do
        allow(Integrations::Oresundskraft::Req).to receive(:call).with(school_integration).and_return(sync_req)
        allow(Ducky::SyncJob).to receive(:perform_later)
      end

      it 'creates a sync' do
        expect { described_class.call(school_integration) }.to change { school_integration.syncs.count }.by(1)
      end

      it 'saves the correct data' do
        service = described_class.call(school_integration)

        expect(service.data.data).to eq(
          'kwh' => data['consumptions']['reading'].pluck('value').sum.round(2),
          'date' => '2023-09-25T00:00:00Z'
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

        expect(service.data.reported_at).to eq(Time.zone.parse('2023-09-25 00:00:00').utc)
      end

      it 'calls Ducky::SyncJob' do
        described_class.call(school_integration)

        expect(Ducky::SyncJob).to have_received(:perform_later)
      end
    end

    context 'when data has no value' do
      let(:school_integration) { create(:school_integration) }
      let(:data) do
        {
          'date' => '2023-09-25T00:00:00',
          'consumptions' => {
            'customerNumber' => '58095',
            'meteringPoint' => '735999124000977318',
            'installationNumber' => '17953',
            'deliveryCategory' => 'EL',
            'microproduction' => false,
            'settlement' => 'FRB',
            'subscribedEffect' => 0,
            'rateCode' => '80A',
            'reading' => [
              {
                'readingDate' => '2023-09-25T00:00:00',
                'value' => '',
                'status' => 'Processed',
                'unit' => 'kWh'
              },
              {
                'readingDate' => '2023-09-25T01:00:00',
                'value' => nil,
                'status' => 'Processed',
                'unit' => 'kWh'
              }
            ]
          }
        }
      end
      let(:sync_req) do
        instance_double(Integrations::Oresundskraft::Req, data:, success?: true)
      end

      before do
        allow(Integrations::Oresundskraft::Req).to receive(:call).with(school_integration).and_return(sync_req)
        allow(Ducky::SyncJob).to receive(:perform_later)
      end

      it 'saves the correct data' do
        service = described_class.call(school_integration)

        expect(service.data.data).to eq(
          'kwh' => nil,
          'date' => '2023-09-25T00:00:00Z'
        )
      end

      it "doesn't call Ducky::SyncJob" do
        described_class.call(school_integration)

        expect(Ducky::SyncJob).not_to have_received(:perform_later)
      end
    end

    context 'when success with no data' do
      let(:school_integration) { create(:school_integration) }
      let(:data) { { 'consumptions' => {}, 'date' => '2023-09-25T00:00:00' } }
      let(:sync_req) do
        instance_double(Integrations::Oresundskraft::Req, data:, success?: true)
      end

      before do
        allow(Integrations::Oresundskraft::Req).to receive(:call).with(school_integration).and_return(sync_req)
        allow(Ducky::SyncJob).to receive(:perform_later)
      end

      it 'creates a sync' do
        expect { described_class.call(school_integration) }.to change { school_integration.syncs.count }.by(1)
      end

      it 'saves the correct status' do
        service = described_class.call(school_integration)

        expect(service.data.status).to eq('success')
      end

      it 'save the correct value' do
        service = described_class.call(school_integration)

        expect(service.data.value).to eq(data)
      end

      it 'does not save any data' do
        service = described_class.call(school_integration)

        expect(service.data.data).to eq({ 'date' => '2023-09-25T00:00:00Z', 'kwh' => nil })
      end

      it "doesn't call Ducky::SyncJob" do
        described_class.call(school_integration)

        expect(Ducky::SyncJob).not_to have_received(:perform_later)
      end
    end

    context 'when failure' do
      let(:school_integration) { create(:school_integration) }
      let(:data) { 'data' }
      let(:sync_req) do
        instance_double(Integrations::Oresundskraft::Req, data:, success?: false)
      end

      before do
        allow(Integrations::Oresundskraft::Req).to receive(:call).with(school_integration).and_return(sync_req)
        allow(Ducky::SyncJob).to receive(:perform_later)
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

      it "doesn't call Ducky::SyncJob" do
        described_class.call(school_integration)

        expect(Ducky::SyncJob).not_to have_received(:perform_later)
      end
    end
  end
end
