# frozen_string_literal: true

require 'rails_helper'

describe Schools, type: :context do
  describe '.get_school' do
    it 'returns a school' do
      school = create(:school)

      expect(described_class.get_school(school.id)).to eq(school)
    end
  end

  describe '.create_school' do
    it 'creates a school' do
      params = {
        name: 'Test School',
        logo: fixture_file_upload('spec/fixtures/logos/vnstraramlisaskola_fnrg.png', 'image/png')
      }

      school = described_class.create_school(params)

      expect(school).to be_a(School)
      expect(school.name).to eq('Test School')
      expect(school.logo).to be_attached
    end
  end

  describe '.update_school' do
    it 'updates a school' do
      school = create(:school, name: 'Test School')

      params = {
        name: 'Updated School',
        main_color: '#000000',
        logo: fixture_file_upload('spec/fixtures/logos/vnstraramlisaskola_fnrg.png', 'image/png')
      }

      service = described_class.update_school(school, params)

      expect(service.data.name).to eq('Updated School')
    end
  end

  describe '.delete_school' do
    it 'deletes a school' do
      school = create(:school)

      described_class.delete_school(school)

      expect(School.count).to eq(0)
    end
  end

  describe '.attach_logo' do
    it 'attaches a logo to a school' do
      school = create(:school)

      described_class.attach_logo(school,
                                  fixture_file_upload('spec/fixtures/logos/vnstraramlisaskola_fnrg.png', 'image/png'))

      expect(school.logo).to be_attached
    end
  end

  describe '.detach_logo' do
    it 'detaches a logo from a school' do
      school = create(:school, :with_logo)

      described_class.detach_logo(school)

      expect(school.logo).not_to be_attached
    end
  end

  describe '.list_schools' do
    it 'lists all schools' do
      create_list(:school, 3)

      schools = described_class.list_schools

      expect(schools.count).to eq(3)
    end
  end
end
