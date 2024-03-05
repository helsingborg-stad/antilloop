# frozen_string_literal: true

require 'rails_helper'

describe Sensors, type: :context do
  describe '.list_sensors' do
    let(:school) { create(:school) }
    let(:sensors) { create_list(:sensor, 5, school:) }

    it 'returns a list of sensors' do
      expect(described_class.list_sensors(school)).to eq(sensors)
    end
  end

  describe '.get_school_sensor_by_external_id' do
    let(:school) { create(:school) }
    let(:sensor) { create(:sensor, school:) }

    it 'returns the sensor' do
      expect(described_class.get_school_sensor_by_external_id(school, external_id: sensor.external_id)).to eq(sensor)
    end
  end

  describe '.get_sensor_by_external_id' do
    let(:sensor) { create(:sensor) }

    it 'returns the sensor' do
      expect(described_class.get_sensor_by_external_id(external_id: sensor.external_id)).to eq(sensor)
    end
  end

  describe '.get_sensor_by_id' do
    let(:sensor) { create(:sensor) }

    it 'returns the sensor' do
      expect(described_class.get_sensor_by_id(id: sensor.id)).to eq(sensor)
    end
  end

  describe '.find_or_create_sensor' do
    let(:school) { create(:school) }
    let(:params) do
      {
        external_id: 'external_id',
        name: 'name',
        device: 'elsys_ers_sound',
        location: 'location'
      }
    end

    context 'when sensor exists' do
      before do
        create(:sensor, school:, external_id: params[:external_id])
      end

      it 'does not create the sensor' do
        expect { described_class.find_or_create_sensor(school, params) }.not_to change(Sensor, :count)
      end

      it 'updates the sensor name and location' do
        service = described_class.find_or_create_sensor(school, params)

        expect(service.success?).to be(true)
        expect(service.data.name).to eq(params[:name])
        expect(service.data.location).to eq(params[:location])
      end

      it 'broadcasts :sensor_updated event' do
        expect do
          described_class.find_or_create_sensor(school, params)
        end.to broadcast(:sensor_updated)
      end
    end

    context 'when sensor does not exist' do
      it 'creates the sensor' do
        expect { described_class.find_or_create_sensor(school, params) }.to change(Sensor, :count).by(1)
      end

      it 'broadcasts :sensor_created event' do
        expect do
          described_class.find_or_create_sensor(school, params)
        end.to broadcast(:sensor_created)
      end
    end

    context 'when params are invalid' do
      let(:params) { {} }

      it 'returns errors' do
        service = described_class.find_or_create_sensor(school, params)

        expect(service.success?).to be(false)
        expect(service.errors).to be_present
      end
    end
  end

  describe '.sync' do
    let(:school) { create(:school) }
    let(:payload) do
      {
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
      }.with_indifferent_access
    end
    let(:external_id) { payload.dig(:iotnode, :_id) }

    context 'when sensor exists' do
      let!(:sensor) { create(:sensor, school:, external_id:) }

      it 'does not create a new sensor' do
        expect { described_class.sync(school, payload) }.not_to(change(Sensor, :count))
      end

      it 'updates the sensor' do
        expect { described_class.sync(school, payload) }.to(change { sensor.reload.updated_at })
      end

      it 'schedules a job to save the sensor sync' do
        expect do
          described_class.sync(school, payload)
        end.to have_enqueued_job(Sensors::SaveSensorSyncJob).with(
          id: sensor.id,
          value: payload[:iotnode]
        )
      end
    end

    context 'when sensor does not exist' do
      it 'creates a new sensor' do
        expect { described_class.sync(school, payload) }.to change(Sensor, :count).by(1)
      end

      it 'schedules a job to save the sensor sync' do
        expect do
          described_class.sync(school, payload)
        end.to have_enqueued_job(Sensors::SaveSensorSyncJob)
      end
    end

    context 'when sensor data is invalid' do
      let(:payload) { { iotnode: { _id: '1', value: { lorem: 'ipsum' }, contextMap: { name: '', device: '' } } } }

      it 'does not create a new sensor' do
        expect { described_class.sync(school, payload) }.not_to(change(Sensor, :count))
      end

      it 'does not schedule a job to save the sensor sync' do
        expect do
          described_class.sync(school, payload)
        end.not_to have_enqueued_job(Sensors::SaveSensorSyncJob)
      end

      it 'validates data' do
        service = described_class.sync(school, payload)

        expect(service.success?).to be(false)
        expect(service.errors).to be_present
        expect(service.errors.messages).to eq({
                                                name: ["can't be blank"],
                                                device: ["can't be blank", 'is not included in the list']
                                              })
      end
    end

    context 'when payload is invalid' do
      let(:payload) { {} }

      it 'does not create a new sensor' do
        expect { described_class.sync(school, payload) }.not_to(change(Sensor, :count))
      end

      it 'does not schedule a job to save the sensor sync' do
        expect do
          described_class.sync(school, payload)
        end.not_to have_enqueued_job(Sensors::SaveSensorSyncJob)
      end

      it 'validates iotnode' do
        service = described_class.sync(school, payload)

        expect(service.success?).to be(false)
        expect(service.errors).to be_present
        expect(service.errors.messages).to eq({
                                                'iotnode._id': ["can't be blank"],
                                                'iotnode.contextMap': ["can't be blank"]
                                              })
      end

      it 'handles exception' do
        allow(Sentry).to receive(:capture_message)

        described_class.sync(school, payload)

        expect(Sentry).to have_received(:capture_message).with(
          "{:\"iotnode._id\"=>[\"can't be blank\"], :\"iotnode.contextMap\"=>[\"can't be blank\"]}",
          level: :warning
        )
      end
    end

    it 'downcases and strips contextMap keys' do
      payload['iotnode']['contextMap'] = {
        'Name ' => 'name',
        ' Device' => 'elsys_ers_co2',
        'LocatioN' => 'location'
      }

      described_class.sync(school, payload)

      expect(Sensor.last.name).to eq(payload.dig('iotnode', 'contextMap', 'Name '))
      expect(Sensor.last.device).to eq(payload.dig('iotnode', 'contextMap', ' Device'))
      expect(Sensor.last.location).to eq(payload.dig('iotnode', 'contextMap', 'LocatioN'))
    end
  end

  describe '.save_sensor_sync' do
    let(:sensor) { create(:sensor) }
    let(:value) do
      {
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
        'sound' => 10,
        'encodedData' => {
          'timestamp' => '2023-07-19T20:28:44.586Z'
        }
      }
    end

    it 'creates a new sensor sync' do
      expect { described_class.save_sensor_sync(sensor, value) }.to change(SensorSync, :count).by(1)
    end

    it 'saves the sensor sync value' do
      described_class.save_sensor_sync(sensor, value)

      expect(sensor.syncs.last.value).to eq(value)
    end

    it 'transforms the value' do
      value =
        {
          'BatteryLevel' => '254',
          'batteryLevel' => nil,
          'NO_PM1' => 21.54,
          'NO_PM2_5' => 22.08,
          'encodedData' => {
            'timestamp' => '2023-07-19T20:28:44.586Z'
          }
        }

      described_class.save_sensor_sync(sensor, value)

      expect(sensor.syncs.last.data).to eq(
        {
          'date' => '2023-07-19T20:28:44Z',
          'no_pm1' => 21.54,
          'no_pm2_5' => 22.08,
          'encoded_data' => { 'timestamp' => '2023-07-19T20:28:44.586Z' },
          'battery_level' => nil
        }
      )
    end

    it 'saves the sensor sync data' do
      described_class.save_sensor_sync(sensor, value)

      expect(sensor.syncs.last.data).to eq(
        {
          'battery_level' => nil,
          'rssi' => -86,
          'snr' => 8.5,
          'spreading_factor' => 11,
          'temperature' => 21.5,
          'relative_humidity' => 51,
          'illuminance' => 2,
          'motion' => 0,
          'co2' => 389,
          'battery_voltage' => 3.627,
          'humidity' => 39,
          'light' => 76,
          'vdd' => 3637,
          'sound' => 10,
          'encoded_data' => {
            'timestamp' => '2023-07-19T20:28:44.586Z'
          },
          'date' => '2023-07-19T20:28:44Z'
        }
      )
    end

    it 'saves reported_at' do
      described_class.save_sensor_sync(sensor, value)

      expect(sensor.syncs.last.reported_at).to eq(Time.zone.parse('2023-07-19T20:28:44Z').utc)
    end

    context 'when montem sensor' do
      let(:sensor) { create(:sensor, device: 'montem') }
      let(:value) do
        {
          'PM1' => 2.77,
          'PM2_5' => 3.35,
          'PM4' => 3.69,
          'PM10' => 3.76,
          'published_at' => '2023-11-07T12:22:44Z'
        }
      end

      it 'saves the sensor sync data' do
        described_class.save_sensor_sync(sensor, value)

        expect(sensor.syncs.last.data).to eq({
                                               'pm4_mass_concentration' => 3.69,
                                               'pm10_0_mass_concentration' => 3.76,
                                               'pm1_0_mass_concentration' => 2.77,
                                               'pm2_5_mass_concentration' => 3.35,
                                               'published_at' => '2023-11-07T12:22:44Z',
                                               'date' => '2023-11-07T12:22:44Z'
                                             })
      end
    end
  end

  describe '.global_sensor_sync' do
    let(:context) { { name: 'name', device: 'montem', location: 'location', external_id: '123' } }
    let(:payload) do
      {
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
      }.with_indifferent_access
    end

    context 'when sensor exists' do
      let!(:sensor) { create(:sensor, school: nil, external_id: context[:external_id]) }

      it 'does not create a new sensor' do
        expect { described_class.global_sensor_sync(context, payload) }.not_to(change(Sensor, :count))
      end

      it 'updates the sensor' do
        expect { described_class.global_sensor_sync(context, payload) }.to(change { sensor.reload.updated_at })
      end

      it 'schedules a job to save the sensor sync' do
        expect do
          described_class.global_sensor_sync(context, payload)
        end.to have_enqueued_job(Sensors::SaveSensorSyncJob).with(
          id: sensor.id,
          value: payload
        )
      end
    end

    context 'when sensor does not exist' do
      it 'creates a new sensor' do
        expect { described_class.global_sensor_sync(context, payload) }.to change(Sensor, :count).by(1)
      end

      it 'schedules a job to save the sensor sync' do
        expect do
          described_class.global_sensor_sync(context, payload)
        end.to have_enqueued_job(Sensors::SaveSensorSyncJob)
      end
    end

    context 'when context is invalid' do
      let(:context) { {} }

      it 'does not create a new sensor' do
        expect { described_class.global_sensor_sync(context, payload) }.not_to(change(Sensor, :count))
      end

      it 'does not schedule a job to save the sensor sync' do
        expect do
          described_class.global_sensor_sync(context, payload)
        end.not_to have_enqueued_job(Sensors::SaveSensorSyncJob)
      end

      it 'returns errors' do
        service = described_class.global_sensor_sync(context, payload)

        expect(service.success?).to be(false)
        expect(service.errors).to be_present
      end
    end
  end
end
