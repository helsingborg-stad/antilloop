# frozen_string_literal: true

require 'rails_helper'

describe School do
  describe '#home_page' do
    it 'returns the home page for the school' do
      school = create(:school)
      home_page = create(:page, school:, home_page: true)
      create(:page, school:, home_page: false)

      expect(school.home_page).to eq(home_page)
    end
  end
end
