# frozen_string_literal: true

require 'rails_helper'

describe Sensor do
  describe '.read_device_name' do
    it 'returns the device model name in snake case' do
      ['polysense sound', 'PolySense Sound', 'PolySense-Sound', 'PolySense_Sound',
       'polysense, sound'].each do |device_model_name|
        result = described_class.read_device_name(device_model_name)

        expect(result).to eq('polysense_sound')
      end
    end

    it 'returns nil if device model name is nil' do
      result = described_class.read_device_name(nil)

      expect(result).to be_nil
    end
  end

  describe '.read_location' do
    it 'returns the location in snake case' do
      ['Room 1', 'Room-1', 'Room_1', 'Room, 1', 'Room,1', 'Room,..1'].each do |location|
        result = described_class.read_location(location)

        expect(result).to eq('room_1')
      end
    end

    it 'returns nil if location is nil' do
      result = described_class.read_location(nil)

      expect(result).to be_nil
    end
  end

  describe '#battery_level_pct' do
    it 'returns the battery level as a percentage' do
      sensor = build(:sensor, battery_level: 128)

      expect(sensor.battery_level_pct).to eq(50)
    end

    it 'returns nil if battery level is nil' do
      sensor = build(:sensor, battery_level: nil)

      expect(sensor.battery_level_pct).to be_nil
    end
  end
end
