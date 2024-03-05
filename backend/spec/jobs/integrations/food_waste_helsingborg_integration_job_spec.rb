# frozen_string_literal: true

require 'rails_helper'

describe Integrations::FoodWasteHelsingborgIntegrationJob do
  describe '#perform' do
    subject(:job) { described_class.perform_now }

    let(:school) { create(:school) }
    let(:integration) do
      create(:integration, key: 'food_waste_helsingborg',
                           url: 'https://matsvinn.helsingborg.se/api/v1/matsvinn/hamta',
                           settings: { enhetKod: '' })
    end
    let!(:school_integration) { create(:school_integration, school:, integration:, settings: { enhetKod: 'enhetKod' }) }

    before do
      date = Time.zone.today - 1.day
      url = "https://matsvinn.helsingborg.se/api/v1/matsvinn/hamta?enhetKod=enhetKod&slutDatum=#{date}&startDatum=#{date}"

      stub_request(:post, url)
        .to_return(body: "{\"lastupdate\":\"2023-07-11T10:56:37.0364259Z\",
        \"results\":[{\"enhetId\":373,\"datum\":\"2023-07-10T00:00:00\",
        \"maltid\":\"lunch\",\"antalAtande\":61,\"antalBestalldaPortioner\":510,
        \"antalSaldaPortioner\":412,\"antalKoptaPortioner\":0,\"koksSvinnGram\":2000,
        \"serveringsSvinnGram\":1600,\"tallriksSvinnGram\":700,
        \"specialkostsSvinnGram\":null,\"kommentar\":\"\"}]}", status: 200)
    end

    it 'performs school integration sync' do
      expect { job }.to change { school_integration.syncs.count }.to(1)
    end

    it 'schedule next job' do
      expect do
        job
      end.to have_enqueued_job(described_class).with(no_args).at(Time.zone.tomorrow.midday.utc).on_queue('integrations')
    end
  end
end
