# frozen_string_literal: true

require 'rails_helper'

describe Pages, type: :context do
  describe '.get_page' do
    it 'gets a page' do
      page = create(:page)

      expect(described_class.get_page(page.id)).to eq(page)
    end
  end

  describe '.find_or_create_page' do
    it 'finds a page' do
      school = create(:school)
      create(:page, school:, name: 'Test Page')

      expect do
        described_class.find_or_create_page(school_id: school.id, name: 'Test Page')
      end.not_to change(Page, :count)
    end

    it 'creates a page' do
      school = create(:school)

      expect { described_class.find_or_create_page(school_id: school.id) }.to change(Page, :count).by(1)
    end
  end

  describe '.create_page' do
    it 'creates a new page' do
      school = create(:school)

      expect { described_class.create_page(school, name: 'Test Page') }.to change(Page, :count).by(1)
    end
  end

  describe '.update_page' do
    it 'updates a page' do
      page = create(:page)

      expect { described_class.update_page(page, name: 'New Name') }.to change { page.reload.name }.to('New Name')
    end
  end

  describe '.delete_page' do
    it 'deletes a page' do
      page = create(:page)

      expect { described_class.delete_page(page) }.to change(Page, :count).by(-1)
    end
  end

  describe '.list_pages' do
    it 'lists all pages' do
      school = create(:school)
      create_list(:page, 3, school:)

      expect(described_class.list_pages(school).count).to eq(3)
    end
  end

  describe '.get_section' do
    it 'gets a section' do
      page = create(:page)
      section = create(:section, page:)

      expect(described_class.get_section(page, section.id)).to eq(section)
    end
  end

  describe '.find_or_create_section' do
    it 'finds a section' do
      page = create(:page)
      create(:section, page:, name: 'Test Section')

      expect do
        described_class.find_or_create_section(page_id: page.id, name: 'Test Section')
      end.not_to change(Section, :count)
    end

    it 'creates a section' do
      page = create(:page)

      expect { described_class.find_or_create_section(page_id: page.id) }.to change(Section, :count).by(1)
    end
  end

  describe '.add_section' do
    it 'adds a section to a page' do
      page = create(:page)

      expect { described_class.add_section(page, name: 'Test Section') }.to change { page.sections.count }.by(1)
    end
  end

  describe '.delete_section' do
    it 'deletes a section from a page' do
      page = create(:page)
      section = create(:section, page:)

      expect { described_class.delete_section(section) }.to change { page.sections.count }.by(-1)
    end
  end

  describe '.list_sections' do
    it 'lists all sections on a page' do
      page = create(:page)
      create_list(:section, 3, page:)

      expect(described_class.list_sections(page).count).to eq(3)
    end
  end

  describe '.add_widget' do
    it 'adds a widget to a page' do
      page = create(:page)
      data_source = create(:school_integration)

      expect do
        described_class.add_widget(page, data_source:, name: 'Test Widget')
      end.to change { page.widgets.count }.by(1)
    end

    it 'adds a widget to a section' do
      page = create(:page)
      section = create(:section, page:)
      data_source = create(:school_integration)

      expect do
        described_class.add_widget(page, section:, data_source:, name: 'Test Widget')
      end.to change { section.widgets.count }.by(1)
    end
  end

  describe '.delete_widget' do
    it 'deletes a widget from a page' do
      page = create(:page)
      widget = create(:widget, page:)

      expect { described_class.delete_widget(widget) }.to change { page.widgets.count }.by(-1)
    end
  end

  describe '.list_page_widgets' do
    it 'lists all widgets on a page' do
      page = create(:page)
      create_list(:widget, 3, page:)

      expect(described_class.list_page_widgets(page).count).to eq(3)
    end
  end

  describe '.list_section_widgets' do
    it 'lists all widgets on a section' do
      section = create(:section)
      create_list(:widget, 3, section:)

      expect(described_class.list_section_widgets(section).count).to eq(3)
    end
  end
end
