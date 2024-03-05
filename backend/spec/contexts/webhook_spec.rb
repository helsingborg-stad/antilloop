# frozen_string_literal: true

require 'rails_helper'

describe Webhook, type: :context do
  describe '.encode_access_token' do
    it 'encodes an access token' do
      client = 'helsingborg'
      school = create(:school)

      access_token = described_class.encode_access_token(client, school)

      expect(access_token).to be_present
    end
  end

  describe '.decode_access_token' do
    it 'decodes an access token' do
      client = 'helsingborg'
      school = create(:school)
      access_token = described_class.encode_access_token(client, school)

      payload = described_class.decode_access_token(access_token)

      expect(payload).to be_present
      expect(payload['client']).to eq(client)
      expect(payload['school_id']).to eq(school.id)
    end
  end

  describe '.webhook_url' do
    it 'returns the webhook url for a school' do
      allow(described_class).to receive(:encode_access_token).and_return('abc')

      school = create(:school)

      expect(described_class.webhook_url(school)).to eq('https://localhost:3000/api/v1/webhook/sensors?access_token=abc')
    end
  end

  describe '.encode_global_sensor_access_token' do
    context 'when external_id is provided' do
      it 'encodes an access token' do
        context = {
          external_id: '123',
          name: 'name',
          device: 'device',
          location: 'location'
        }

        access_token = described_class.encode_global_sensor_access_token(**context)

        expect(access_token).to be_present
      end
    end

    context 'when external_id is not provided' do
      it 'encodes an access token' do
        context = {
          name: 'name',
          device: 'device',
          location: 'location'
        }

        access_token = described_class.encode_global_sensor_access_token(**context)

        expect(access_token).to be_present
      end
    end
  end

  describe '.global_sensor_webhook_url' do
    context 'when external_id is provided' do
      it 'returns the webhook url for a sensor' do
        context = {
          external_id: '123',
          name: 'name',
          device: 'device',
          location: 'location'
        }

        allow(described_class).to receive(:encode_global_sensor_access_token).with(**context).and_return('abc')

        expect(described_class.global_sensor_webhook_url(**context)).to eq('https://localhost:3000/api/v1/webhook/global/sensors?access_token=abc')
      end
    end

    context 'when external_id is not provided' do
      it 'returns the webhook url for a sensor' do
        context = {
          name: 'name',
          device: 'device',
          location: 'location'
        }

        allow(described_class).to receive(:encode_global_sensor_access_token).and_return('abc')

        expect(described_class.global_sensor_webhook_url(**context)).to eq('https://localhost:3000/api/v1/webhook/global/sensors?access_token=abc')
      end
    end
  end
end
