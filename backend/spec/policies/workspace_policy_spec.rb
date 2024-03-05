# frozen_string_literal: true

require 'rails_helper'

describe WorkspacePolicy, type: :policy do
  subject(:school_policy) { described_class }

  let(:school) { create(:school) }
  let(:user) { create(:user, school:) }

  permissions :list_sensors?,
              :list_integrations?,
              :create_school_integration?,
              :update_school_integration?,
              :delete_school_integration?,
              :show_school?,
              :update_school? do
    it 'grants access if user belongs to school' do
      expect(school_policy).to permit(user, school)
    end

    it 'denies access if user does not belong to school' do
      expect(school_policy).not_to permit(create(:user), school)
    end
  end
end
