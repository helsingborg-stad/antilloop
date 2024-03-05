# frozen_string_literal: true

require 'rails_helper'

describe Integrations::FoodWasteHelsingborg::Sync, type: :context do
  describe '.call' do
    context 'when success' do
      let(:school_integration) { create(:school_integration) }
      let(:data) do
        { 'results' => [{ 'koksSvinnGram' => 100, 'antalAtande' => 10, 'datum' => '2023-07-24T00:00:00' }] }
      end
      let(:sync_req) do
        instance_double(Integrations::FoodWasteHelsingborg::Req, data:, success?: true)
      end

      before do
        allow(Integrations::FoodWasteHelsingborg::Req).to receive(:call).with(school_integration).and_return(sync_req)
      end

      it 'creates a sync' do
        expect { described_class.call(school_integration) }.to change { school_integration.syncs.count }.by(1)
      end

      it 'saves the correct data' do
        service = described_class.call(school_integration)

        expect(service.data.data).to eq(
          'attendees_count' => 10,
          'waste_in_g' => 100,
          'waste_in_g_per_person' => 10,
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

        expect(service.data.reported_at).to eq(Time.zone.parse('2023-07-24T00:00:00').utc)
      end
    end

    context 'when results are empty' do
      let(:school_integration) { create(:school_integration) }
      let(:data) do
        { 'results' => [] }
      end
      let(:sync_req) do
        instance_double(Integrations::FoodWasteHelsingborg::Req, data:, success?: true)
      end

      before do
        allow(Integrations::FoodWasteHelsingborg::Req).to receive(:call).with(school_integration).and_return(sync_req)
      end

      it 'creates a sync' do
        expect { described_class.call(school_integration) }.to change { school_integration.syncs.count }.by(1)
      end

      it 'saves the correct data' do
        service = described_class.call(school_integration)

        expect(service.data.data).to eq({
                                          'attendees_count' => nil,
                                          'date' => (Time.zone.now.utc.beginning_of_day - 1.day).iso8601,
                                          'waste_in_g' => nil,
                                          'waste_in_g_per_person' => nil
                                        })
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

        expect(service.data.reported_at).to eq((Time.zone.now.utc.beginning_of_day - 1.day).iso8601)
      end
    end

    context 'when failure' do
      let(:school_integration) { create(:school_integration) }
      let(:data) { 'data' }
      let(:sync_req) do
        instance_double(Integrations::FoodWasteHelsingborg::Req, data:, success?: false)
      end

      before do
        allow(Integrations::FoodWasteHelsingborg::Req).to receive(:call).with(school_integration).and_return(sync_req)
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

    context 'when antalAtande=0' do
      let(:school_integration) { create(:school_integration) }
      let(:data) { { 'results' => [{ 'koksSvinnGram' => 100, 'antalAtande' => 0, 'datum' => '2023-07-24T00:00:00' }] } }
      let(:sync_req) do
        instance_double(Integrations::FoodWasteHelsingborg::Req, data:, success?: true)
      end

      before do
        allow(Integrations::FoodWasteHelsingborg::Req).to receive(:call).with(school_integration).and_return(sync_req)
      end

      it 'saves the correct data' do
        service = described_class.call(school_integration)

        expect(service.data.data).to eq(
          'attendees_count' => 0,
          'waste_in_g' => 100,
          'waste_in_g_per_person' => nil,
          'date' => '2023-07-24T00:00:00Z'
        )
      end
    end
  end
end
