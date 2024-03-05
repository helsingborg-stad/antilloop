# frozen_string_literal: true

require 'rails_helper'

describe Integrations::LumaEnergyIntegrationJob do
  describe '#perform' do
    subject(:job) { described_class.perform_now }

    let(:school) { create(:school) }
    let(:integration) do
      create(:integration, key: 'luma_energy',
                           url: 'https://api.powercloudplatform.com/systems/series/energy',
                           settings: { system_ids: 'string', api_key: 'string' })
    end
    let(:school_integration) do
      create(:school_integration, school:, integration:, settings: { system_ids: 'system_ids', api_key: 'api_key' })
    end

    before do
      from = Time.zone.today - 2.days
      to = Time.zone.today - 1.day
      url = "https://api.powercloudplatform.com/systems/series/energy?from=#{from}&multiple_value_types=true&resolution=day&system_ids=system_ids&to=#{to}"

      stub_request(:get, url)
        .with(headers: { 'Authorization' => 'Api-Key api_key' })
        .to_return(body: "{\"meta\":{\"system_ids\":[\"e858ff61-5588-cd41-7224-80f2e7458607\"],
        \"value_type\":\"ac_e_pos_tot\",\"resolution\":\"day\",\"from\":\"2023-07-09T00:00:00Z\",
        \"to\":\"2023-07-10T00:00:00Z\",\"time_unix\":false,\"multiple_value_types\":true},
        \"result\":[{\"system_id\":\"e858ff61-5588-cd41-7224-80f2e7458607\",\"popular_name\":
        \"Helsingborg - Västra Ramlösa Skola 1 (Helsingborg Stad)\",\"facility_id\":
        \"357ef2c5-d1ac-c8f8-8e44-0d94f32d117e\",\"enabled\":true,\"registered_at\":
        \"2020-01-10T13:12:40.000Z\",\"system_type\":\"solar\",\"ean\":null,
        \"meta\":{\"vendor\":null,\"pv_area\":null,\"internal\":true,\"start_date\":
        \"2019-12-05T12:00:00+00:00\",\"has_service\":false,\"cesar_enabled\":false,
        \"installed_power\":32.4,\"has_production_guarantee\":false},\"description\":null,
        \"data\":[{\"value_type\":\"i_ac_e_pos_tot\",\"time_utc\":[\"2023-07-09T00:00:00.000Z\",
        \"2023-07-10T00:00:00.000Z\"],\"time_unix\":[1688860800,1688947200],\"absolute\":[127437480,127476736],
        \"relative\":[224672,39256]}]}]}", status: 200)
    end

    it 'performs school integration sync' do
      expect { job }.to change { school_integration.syncs.count }.to(1)
    end

    it 'schedules next job' do
      expect do
        job
      end.to have_enqueued_job(described_class).with(no_args).at(Time.zone.tomorrow.midday.utc).on_queue('integrations')
    end
  end
end
