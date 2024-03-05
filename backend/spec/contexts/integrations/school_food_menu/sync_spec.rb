# frozen_string_literal: true

require 'rails_helper'

describe Integrations::SchoolFoodMenu::Sync, type: :context do
  describe '.call' do
    context 'when success' do
      let(:school_integration) { create(:school_integration) }
      let(:data) do
        {
          'weeks' => [
            {
              'number' => 1,
              'year' => 2023,
              'days' => [
                {
                  'date' => 1_689_552_000,
                  'items' => %w[
                    item1
                    item2
                  ]
                }
              ]
            },
            {
              'number' => 2,
              'year' => 2023,
              'days' => [
                {
                  'date' => 1_690_156_800,
                  'items' => %w[
                    item1
                    item2
                  ]
                }
              ]
            },
            {
              'number' => 3,
              'year' => 2023,
              'days' => [
                {
                  'date' => 1_690_761_600,
                  'items' => %w[
                    item1
                    item2
                  ]
                }
              ]
            }
          ]
        }
      end
      let(:sync_req) do
        instance_double(Integrations::SchoolFoodMenu::Req, data:, success?: true)
      end

      before do
        allow(Integrations::SchoolFoodMenu::Req).to receive(:call).with(school_integration).and_return(sync_req)
      end

      it 'creates a sync' do
        expect { described_class.call(school_integration) }.to change { school_integration.syncs.count }.by(3)
      end

      it 'saves the correct data' do
        service = described_class.call(school_integration)

        expect(service.data[0].data).to eq({
                                             'date' => Time.zone.at(1_689_552_000).utc.iso8601,
                                             'items' => %w[
                                               item1
                                               item2
                                             ]
                                           })

        expect(service.data[1].data).to eq({
                                             'date' => Time.zone.at(1_690_156_800).utc.iso8601,
                                             'items' => %w[
                                               item1
                                               item2
                                             ]
                                           })

        expect(service.data[2].data).to eq({
                                             'date' => Time.zone.at(1_690_761_600).utc.iso8601,
                                             'items' => %w[
                                               item1
                                               item2
                                             ]
                                           })
      end

      it 'updates the data' do
        school_integration_sync = create(:school_integration_sync,
                                         school_integration:,
                                         data: { 'date' => Time.zone.at(1_689_552_000).utc.iso8601,
                                                 'items' => %w[item1] },
                                         value: { 'date' => 1_689_552_000, 'items' => %w[item1] },
                                         status: :success)

        described_class.call(school_integration)

        expect(school_integration_sync.reload.data).to eq(
          'date' => Time.zone.at(1_689_552_000).utc.iso8601,
          'items' => %w[
            item1
            item2
          ]
        )
      end

      it 'saves the correct value' do
        service = described_class.call(school_integration)

        expect(service.data[0].value).to eq({
                                              'date' => 1_689_552_000,
                                              'items' => %w[
                                                item1
                                                item2
                                              ]
                                            })

        expect(service.data[1].value).to eq({
                                              'date' => 1_690_156_800,
                                              'items' => %w[
                                                item1
                                                item2
                                              ]
                                            })

        expect(service.data[2].value).to eq({
                                              'date' => 1_690_761_600,
                                              'items' => %w[
                                                item1
                                                item2
                                              ]
                                            })
      end

      it 'saves the correct status' do
        service = described_class.call(school_integration)

        expect(service.data).to be_all(&:success?)
      end

      it 'saves data_source_key' do
        service = described_class.call(school_integration)

        expect(service.data).to be_all do |school_integration_sync|
          school_integration_sync.data_source_key == school_integration.key
        end
      end

      it 'saves reported_at' do
        service = described_class.call(school_integration)

        expect(service.data[0].reported_at).to eq(Time.zone.at(1_689_552_000).utc.iso8601)

        expect(service.data[1].reported_at).to eq(Time.zone.at(1_690_156_800).utc.iso8601)

        expect(service.data[2].reported_at).to eq(Time.zone.at(1_690_761_600).utc.iso8601)
      end
    end

    context 'when failure' do
      let(:school_integration) { create(:school_integration) }
      let(:data) { 'data' }
      let(:sync_req) do
        instance_double(Integrations::SchoolFoodMenu::Req, data:, success?: false)
      end

      before do
        allow(Integrations::SchoolFoodMenu::Req).to receive(:call).with(school_integration).and_return(sync_req)
      end

      it 'creates a sync' do
        expect { described_class.call(school_integration) }.to change { school_integration.syncs.count }.by(1)
      end

      it 'saves the correct status' do
        service = described_class.call(school_integration)

        expect(service.data.status).to eq('failure')
      end
    end
  end
end
