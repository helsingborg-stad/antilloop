# frozen_string_literal: true

require 'rails_helper'

describe Widgets, type: :context do
  describe '.get_widget' do
    it 'returns the widget' do
      widget = create(:widget)

      expect(described_class.get_widget(widget.id)).to eq(widget)
    end
  end

  describe '.list_data' do
    context 'when data source is a sensor' do
      let(:sensor) { create(:sensor) }
      let(:widget) { create(:widget, data_source: sensor) }

      before do
        create_list(:sensor_sync, 3, sensor:, reported_at: Time.zone.now.utc.iso8601)
      end

      it 'returns the sensor data' do
        expect(described_class.list_data(widget)).to eq(sensor.data.order(reported_at: :asc))
      end
    end

    context 'when data source is an integration' do
      let(:school_integration) { create(:school_integration) }
      let(:widget) { create(:widget, data_source: school_integration) }

      before do
        create_list(:school_integration_sync, 3, school_integration:, reported_at: Time.zone.now.utc.iso8601)
      end

      it 'returns the integration data' do
        expect(described_class.list_data(widget)).to eq(school_integration.data.order(reported_at: :desc))
      end
    end

    context 'when assoc_data is present' do
      let(:school) { create(:school) }
      let(:school_integration_1) { create(:school_integration, school:) }
      let(:school_integration_2) { create(:school_integration, school:) }
      let(:widget) { create(:widget, data_source: school_integration_1) }
      let(:date) { Time.zone.now.utc.iso8601 }

      before do
        create(:school_integration_sync, school_integration: school_integration_1, data: { date: }, reported_at: date)
        create(:school_integration_sync, school_integration: school_integration_2, data: { date: }, reported_at: date)
        create(:school_integration_sync, data: { date: }, reported_at: date)
      end

      it 'joins the assoc_data' do
        expect(
          described_class.list_data(widget).first.assoc_data.pluck('school_integration_id')
        ).to eq([school_integration_2.id])
      end
    end

    context 'when from and to are not present' do
      let(:sensor) { create(:sensor) }
      let(:widget) { create(:widget, data_source: sensor) }

      before do
        create(:sensor_sync, sensor:, reported_at: (Time.zone.now.utc.beginning_of_day - 1.hour).iso8601)
        create(:sensor_sync, sensor:, reported_at: (Time.zone.now.utc.beginning_of_day + 1.hour).iso8601)
      end

      it 'returns the data for the current day' do
        expect(described_class.list_data(widget).to_a.size).to eq(1)
      end
    end

    context 'when from and to are present' do
      let(:sensor) { create(:sensor) }
      let(:widget) { create(:widget, data_source: sensor) }

      before do
        create(:sensor_sync, sensor:, reported_at: (Time.zone.now.utc.beginning_of_day - 1.hour).iso8601)
        create(:sensor_sync, sensor:, reported_at: (Time.zone.now.utc.beginning_of_day + 1.hour).iso8601)
      end

      it 'returns the data for the given from/to range' do
        from = Time.zone.now.utc.beginning_of_day - 1.hour

        expect(described_class.list_data(widget, from: from.iso8601).to_a.size).to eq(2)

        from = Time.zone.now.utc.beginning_of_day - 1.hour
        to = Time.zone.now.utc.beginning_of_day

        expect(described_class.list_data(widget, from: from.iso8601, to: to.iso8601).to_a.size).to eq(1)

        to = Time.zone.now.utc.beginning_of_day + 1.hour + 1.second

        expect(described_class.list_data(widget, to: to.iso8601).to_a.size).to eq(1)
      end
    end

    context 'when sensor does not have school' do
      let(:sensor) { create(:sensor, school: nil) }
      let(:widget) { create(:widget, data_source: sensor) }

      before do
        create_list(:sensor_sync, 3, sensor:, reported_at: Time.zone.now.utc.iso8601)
      end

      it 'returns the sensor data' do
        expect(described_class.list_data(widget)).to eq(sensor.data.order(reported_at: :asc))
      end
    end
  end

  describe '.latest_data' do
    context 'when data source is a sensor' do
      let(:sensor) { create(:sensor) }
      let(:widget) { create(:widget, data_source: sensor) }

      before do
        create_list(:sensor_sync, 3, sensor:)
      end

      it 'returns the sensor data' do
        expect(described_class.latest_data(widget)).to eq(sensor.data.order_by_reported_at_desc.first)
      end
    end

    context 'when data source is an integration' do
      let(:school_integration) { create(:school_integration) }
      let(:widget) { create(:widget, data_source: school_integration) }

      before do
        create_list(:school_integration_sync, 3, school_integration:)
      end

      it 'returns the integration data' do
        expect(described_class.latest_data(widget)).to eq(school_integration.data.order_by_reported_at_desc.first)
      end
    end
  end

  # rubocop:disable RSpec/LetSetup
  describe '.latest_present_data' do
    context 'when data source is a sensor' do
      let(:sensor) { create(:sensor) }
      let(:widget) { create(:widget, data_source: sensor) }

      let!(:sensor_sync_1) { create(:sensor_sync, sensor:, data: { a: 1, b: nil }, reported_at: 3.days.ago) }
      let!(:sensor_sync_2) { create(:sensor_sync, sensor:, data: { a: 1, b: '' }, reported_at: 2.days.ago) }
      let!(:sensor_sync_3) { create(:sensor_sync, sensor:, data: { a: 1, b: nil }, reported_at: 1.day.ago) }

      it 'returns the sensor data' do
        expect(described_class.latest_present_data(widget)).to eq(sensor_sync_3)
      end
    end

    context 'when data source is an integration' do
      let(:integration) { create(:integration, key: 'food_waste_helsingborg') }
      let(:school_integration) { create(:school_integration, integration:) }
      let(:widget) { create(:widget, data_source: school_integration) }

      let!(:school_integration_sync_1) do
        create(:school_integration_sync, school_integration:, data: { a: 1, b: 2 }, reported_at: 3.days.ago)
      end
      let!(:school_integration_sync_2) do
        create(:school_integration_sync, school_integration:, data: { a: 1, b: '' }, reported_at: 2.days.ago)
      end
      let!(:school_integration_sync_3) do
        create(:school_integration_sync, school_integration:, data: { a: 1, b: nil }, reported_at: 1.day.ago)
      end

      it 'returns the integration data' do
        expect(described_class.latest_present_data(widget)).to eq(school_integration_sync_1)
      end
    end
  end
  # rubocop:enable RSpec/LetSetup

  describe '.current_data' do
    context 'when data for the current day is present' do
      let(:sensor) { create(:sensor) }
      let(:widget) { create(:widget, data_source: sensor) }

      before do
        create(:sensor_sync, sensor:, reported_at: (Time.zone.now.utc.beginning_of_day - 1.day).iso8601)
        create(:sensor_sync, sensor:, reported_at: Time.zone.now.utc.beginning_of_day.iso8601)
        create(:sensor_sync, sensor:, reported_at: (Time.zone.now.utc.beginning_of_day + 1.day).iso8601)
      end

      it 'returns the current data' do
        expect(described_class.current_data(widget)).to eq(sensor.data.order_by_reported_at_desc.second)
      end
    end

    context 'when data for the current day is not present' do
      let(:sensor) { create(:sensor) }
      let(:widget) { create(:widget, data_source: sensor) }

      before do
        create(:sensor_sync, sensor:, reported_at: (Time.zone.now.utc.beginning_of_day - 1.day).iso8601)
        create(:sensor_sync, sensor:, reported_at: (Time.zone.now.utc.beginning_of_day + 1.day).iso8601)
      end

      it 'returns nil' do
        expect(described_class.current_data(widget)).to be_nil
      end
    end
  end
end
