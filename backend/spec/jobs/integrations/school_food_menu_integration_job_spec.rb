# frozen_string_literal: true

require 'rails_helper'

describe Integrations::SchoolFoodMenuIntegrationJob do
  describe '#perform' do
    subject(:job) { described_class.perform_now }

    let(:school) { create(:school) }
    let(:integration) do
      create(:integration, key: 'school_food_menu',
                           url: 'https://skolmaten.se/api/3/menu',
                           settings: { school: 'string', client: 'string' })
    end
    let(:school_integration) do
      create(:school_integration, school:, integration:, settings: { school: 'school', client: 'client' })
    end

    before do
      stub_request(:get, 'https://skolmaten.se/api/3/menu?client=client&limit=3&offset=-1&school=school')
        .to_return(body: "{\"feedbackAllowed\":false,\"weeks\":[{
          \"days\":[{\"date\":1688947200},{\"date\":1689033600},{\"date\":1689120000},{
          \"date\":1689206400},{\"date\":1689292800}],\"number\":28,\"year\":2023},{
          \"days\":[{\"date\":1689552000},{\"date\":1689638400},{\"date\":1689724800},{
          \"date\":1689811200},{\"date\":1689897600}],\"number\":29,\"year\":2023}],
          \"school\":{\"URLName\":\"vastra-ramlosa-skola\",\"imageURL\":
          \"https://lh3.googleusercontent.com/8OkQ5VbKd27_7eUh0-Q32QLigwB4rZEZYc1THb9-uuaV_Sb62n6-byHFy1D26Kf2ndmXfG1fOl8ZGyW8XBDGUvIpod9guQT9\",
          \"id\":5007135217811456,\"district\":{\"province\":{\"URLName\":\"skane-lan\",
          \"id\":5716216131878912,\"name\":\"Sk\\u00e5ne l\\u00e4n\"},\"URLName\":\"helsingborgs-stad\",
          \"id\":65005,\"name\":\"Helsingborgs stad\"},\"name\":\"V\\u00e4stra Raml\\u00f6sa skola\"},\"id\":206001,
          \"bulletins\":[{\"text\":\"Med reservation f\\u00f6r \\u00e4ndringar\",\"imageURL\":
          \"https://lh3.googleusercontent.com/UUEwRkokDQIuP2GxjlHJU0lE4BAIRT5bB3de3DlH5m41BZAn8VgLiJpVGZ9fXYVI_lJ7wjJGwVWoJ75jo_J4BOUiceK2L4E\",
          \"linkURL\":\"https://helsingborg.se/forskola-och-utbildning/helsingborgs-stads-skolor/skolmat/\"},{
          \"text\":\"Dagligen serveras en ...\",
          \"imageURL\":\"https://lh3.googleusercontent.com/BeXIW2qJCBqS6uTNjoZxvZUBSZnerUlba_rnWZWD4DBZLqutAlJ3Bz8Oiocusj8JB102aGY1kOwj8p5o1XWwP5O4C6Mv30w\",
          \"linkURL\":\"https://helsingborg.se/forskola-och-utbildning/helsingborgs-stads-skolor/skolmat/\"}]}",
                   status: 200)
    end

    it 'performs school integration sync' do
      expect { job }.to change { school_integration.syncs.count }.to(10)
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
