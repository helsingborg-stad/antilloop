# frozen_string_literal: true

require 'rails_helper'

describe Sensors::SaveSensorSyncJob do
  let(:school) { create(:school) }
  let(:sensor) { create(:sensor, school:) }
  let(:value) do
    {
      'co2' => 1000,
      'humidity' => 50,
      'illuminance' => 100,
      'light' => 100,
      'motion' => 0,
      'temperature' => 20
    }
  end

  describe '#perform' do
    subject(:perform) { described_class.perform_now(id: sensor.id, value:) }

    it 'creates a new sensor sync' do
      expect { perform }.to change(SensorSync, :count).by(1)
    end

    it 'creates a new sensor sync with the correct attributes' do
      perform

      expect(SensorSync.last).to have_attributes(
        sensor_id: sensor.id,
        value:
      )
    end
  end
end
