# frozen_string_literal: true

require 'swagger_helper'

describe 'Webhook Global Sensors API V1' do
  path '/api/v1/webhook/global/sensors' do
    post 'process sensor payload' do
      tags 'Webhook Global Sensors'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :access_token, in: :query, schema: { type: :string }, required: true
      parameter name: :payload, in: :body, schema: { type: :object }, required: true

      response 200, 'successful' do
        let(:context) do
          {
            external_id: '123',
            name: 'name',
            device: 'montem',
            location: 'location'
          }
        end
        let(:access_token) { Webhook.encode_global_sensor_access_token(**context) }
        let(:payload) do
          {
            'payload' => {
              'temperature' => 5.95,
              'atmospheric_pressure' => 998.78,
              'relative_humidity' => 66.66,
              'luminosity' => 0,
              'battery_percentage' => 100,
              'noise_avarage' => 69.12,
              'noise_min' => 50.05,
              'noise_max' => 75.69,
              'noise_standard_deveation' => 6.96,
              'PM1' => 2.77,
              'PM2_5' => 3.35,
              'PM4' => 3.69,
              'PM10' => 3.76,
              'NO_PM1' => 21.54,
              'NO_PM2_5' => 22.08,
              'NO_PM4' => 22.19,
              'NO_PM10' => 22.21,
              'avarage_particle_size' => 0.64,
              'published_at' => '2023-11-07T12:22:44Z'
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
        let(:access_token) { '' }
        let(:payload) { { 'payload' => {} } }

        run_test!
      end

      response 422, 'unprocessable entity' do
        let(:context) do
          {
            external_id: '123',
            name: 'name',
            device: 'unknown',
            location: 'location'
          }
        end
        let(:access_token) { Webhook.encode_global_sensor_access_token(**context) }
        let(:payload) { { 'payload' => { 'key' => 'value' } } }

        run_test!
      end

      response 400, 'bad request' do
        let(:context) do
          {
            external_id: '123',
            name: 'name',
            device: 'unknown',
            location: 'location'
          }
        end
        let(:access_token) { Webhook.encode_global_sensor_access_token(**context) }
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
