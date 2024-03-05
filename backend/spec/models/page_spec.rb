# frozen_string_literal: true

require 'rails_helper'

describe Page do
  describe '#widgets_without_section' do
    it 'returns widgets without section' do
      page = create(:page)
      widget = create(:widget, page:)
      create(:widget, page:, section: create(:section, page:))

      expect(page.widgets_without_section).to eq([widget])
    end
  end
end
