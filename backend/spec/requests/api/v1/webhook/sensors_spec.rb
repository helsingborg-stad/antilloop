# frozen_string_literal: true

require 'swagger_helper'

describe 'Webhook Sensors API V1' do
  path '/api/v1/webhook/sensors' do
    post 'process sensor payload' do
      tags 'Webhook Sensors'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :access_token, in: :query, schema: { type: :string }, required: true
      parameter name: :payload, in: :body, schema: { type: :object }, required: true

      response 200, 'successful' do
        let(:school) { create(:school) }
        let(:access_token) { Webhook.encode_access_token('client', school) }
        let(:payload) do
          {
            'payload' => {
              'iotnode' =>
              {
                '_id' => '5ff713960e013f0006121e5f',
                'deviceModelName' => 'elsys-ers-co2',
                'name' => 'name',
                'BatteryLevel' => '254',
                'batteryLevel' => nil,
                'rssi' => -86,
                'snr' => 8.5,
                'spreadingFactor' => 11,
                'temperature' => 21.5,
                'relativeHumidity' => 51,
                'illuminance' => 2,
                'motion' => 0,
                'co2' => 389,
                'batteryVoltage' => 3.627,
                'humidity' => 39,
                'light' => 76,
                'vdd' => 3637,
                'value' => {
                  'BatteryLevel' => '254',
                  'batteryLevel' => nil,
                  'rssi' => -86,
                  'snr' => 8.5,
                  'spreadingFactor' => 11,
                  'temperature' => 21.5,
                  'relativeHumidity' => 51,
                  'illuminance' => 2,
                  'motion' => 0,
                  'co2' => 389,
                  'batteryVoltage' => 3.627,
                  'humidity' => 39,
                  'light' => 76,
                  'vdd' => 3637
                },
                'contextMap' => {
                  'location' => 'location',
                  'device' => 'elsys-ers-co2',
                  'name' => 'name'
                }
              }
            }
          }
        end

        after do |spec|
          spec.metadata[:operation][:request_examples] ||= []

          example = {
            value: JSON.parse(request.body.string, symbolize_names: true),
            name: 'request_example_1',
            summary: 'A request example'
          }

          spec.metadata[:operation][:request_examples] << example
        end

        run_test!
      end

      response 401, 'unauthorized' do
        let(:school) { create(:school) }
        let(:access_token) { '' }
        let(:payload) { { 'payload' => {} } }

        run_test!
      end

      response 422, 'unprocessable entity' do
        let(:school) { create(:school) }
        let(:access_token) { Webhook.encode_access_token('client', school) }
        let(:payload) do
          {
            'payload' => {
              'iotnode' => {}
            }
          }
        end

        run_test!
      end

      response 400, 'bad request' do
        let(:school) { create(:school) }
        let(:access_token) { Webhook.encode_access_token('client', school) }
        let(:payload) { {} }

        before do
          allow(Sentry).to receive(:capture_message)
        end

        run_test! do |response|
          data = JSON.parse(response.body, symbolize_names: true)

          expect(data[:message]).to eq('param is missing or the value is empty: payload')
          expect(Sentry).to have_received(:capture_message).with('param is missing or the value is empty: payload',
                                                                 level: :warning)
        end
      end
    end
  end
end
