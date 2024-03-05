# frozen_string_literal: true

require 'swagger_helper'

describe 'School Home Page API V1' do
  path '/api/v1/schools/{school_id}/home_page' do
    get 'show home page' do
      tags 'Home Page'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :school_id, in: :path, type: :integer
      parameter name: :locale, in: :query, schema: { type: :string, enum: I18n.available_locales }, required: false

      response 200, 'successful' do
        let(:school) { create(:school) }
        let(:page) { create(:page, school:, home_page: true) }
        let(:school_id) { school.id }

        before do
          create(:widget, page:, section: create(:section, page:, theme: 'food'), sn: 0,
                          data_source_key: 'food_waste_helsingborg')
          create(:widget, page:, sn: 1, data_source_key: 'elsys_ers_sound/sound')
        end

        run_test!
      end
    end
  end
end
