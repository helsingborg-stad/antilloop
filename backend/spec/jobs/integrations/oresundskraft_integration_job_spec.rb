# frozen_string_literal: true

require 'rails_helper'

describe Integrations::OresundskraftIntegrationJob do
  describe '#perform' do
    subject(:job) { described_class.perform_now }

    let(:school) { create(:school) }
    let(:integration) do
      create(:integration, key: 'oresundskraft',
                           url: 'https://oows.oresundskraft.se/ConsumptionExternal/api/Consumption/TimeSeries/Customers',
                           settings: {
                             'Ocp-Apim-Subscription-Key' => 'string',
                             'customerNumber' => 'string',
                             'meteringPoint' => 'string'
                           })
    end
    let(:school_integration) do
      create(:school_integration, school:,
                                  integration:,
                                  settings: {
                                    'Ocp-Apim-Subscription-Key' => 'Ocp-Apim-Subscription-Key',
                                    'customerNumber' => 'customerNumber',
                                    'meteringPoint' => 'meteringPoint'
                                  })
    end

    # rubocop:disable Layout/LineLength
    before do
      to_date = Time.zone.today
      from_date = Time.zone.today - 1.day
      url = "https://oows.oresundskraft.se/ConsumptionExternal/api/Consumption/TimeSeries/Customers?toDate=#{to_date}&fromDate=#{from_date}&deliveryCategories=EL&offset=0&maxRows=0&customerNumbers=#{school_integration.settings['customerNumber']}&subsidiary=false"

      stub_request(:get, url)
        .with(headers: { 'Ocp-Apim-Subscription-Key' => 'Ocp-Apim-Subscription-Key', 'api-version' => '2.1' })
        .to_return(body: '{"consumptions":[{"customerNumber":"customerNumber","meteringPoint":"meteringPoint","installationNumber":"17953","deliveryCategory":"EL","microproduction":false,"settlement":"FRB","subscribedEffect":0,"rateCode":"80A","reading":[{"readingDate":"2023-09-25T00:00:00","value":4.454,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T01:00:00","value":4.488,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T02:00:00","value":4.426,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T03:00:00","value":4.46,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T04:00:00","value":4.484,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T05:00:00","value":4.526,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T06:00:00","value":7.192,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T07:00:00","value":10.218,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T08:00:00","value":6.588,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T09:00:00","value":1.052,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T10:00:00","value":0.03,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T11:00:00","value":0.0,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T12:00:00","value":1.584,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T13:00:00","value":1.436,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T14:00:00","value":0.31,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T15:00:00","value":0.678,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T16:00:00","value":3.788,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T17:00:00","value":6.91,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T18:00:00","value":9.45,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T19:00:00","value":11.364,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T20:00:00","value":10.932,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T21:00:00","value":5.484,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T22:00:00","value":4.478,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T23:00:00","value":4.458,"status":"Processed","unit":"kWh"}]},{"customerNumber":"58095","meteringPoint":"735999124000289640","installationNumber":"61482802","deliveryCategory":"EL","microproduction":false,"settlement":"","subscribedEffect":0,"rateCode":"80A","reading":[{"readingDate":"2023-09-25T00:00:00","value":1.454,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T01:00:00","value":1.373,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T02:00:00","value":1.486,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T03:00:00","value":1.429,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T04:00:00","value":1.69,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T05:00:00","value":1.555,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T06:00:00","value":3.042,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T07:00:00","value":5.03,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T08:00:00","value":4.112,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T09:00:00","value":4.273,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T10:00:00","value":4.182,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T11:00:00","value":4.455,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T12:00:00","value":4.855,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T13:00:00","value":4.634,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T14:00:00","value":3.972,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T15:00:00","value":3.194,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T16:00:00","value":3.3,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T17:00:00","value":1.477,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T18:00:00","value":0.874,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T19:00:00","value":1.26,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T20:00:00","value":1.37,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T21:00:00","value":1.258,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T22:00:00","value":1.331,"status":"Processed","unit":"kWh"},{"readingDate":"2023-09-25T23:00:00","value":1.325,"status":"Processed","unit":"kWh"}]}]}', status: 200)
    end
    # rubocop:enable Layout/LineLength

    it 'performs school integration sync' do
      expect { job }.to change { school_integration.syncs.count }.to(1)
    end

    it 'schedules next job' do
      expect do
        job
      end.to have_enqueued_job(described_class)
        .with(no_args)
        .at(Time.zone.tomorrow.midday.utc)
        .on_queue('integrations')
    end
  end
end
