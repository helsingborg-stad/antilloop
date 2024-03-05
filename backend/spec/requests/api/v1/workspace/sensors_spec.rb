# frozen_string_literal: true

require 'swagger_helper'

describe 'Workspace Sensors API V1' do
  path '/api/v1/workspace/schools/{school_id}/sensors' do
    get 'list sensors' do
      tags 'Workspace Sensors'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :school_id, in: :path, type: :string, required: true
      parameter name: :locale, in: :query, schema: { type: :string, enum: I18n.available_locales }, required: false
      parameter name: 'Authorization', in: :header, type: :string
      parameter name: :page, in: :query, schema: { type: :integer }, required: false
      parameter name: :per_page, in: :query, schema: { type: :integer }, required: false

      response 200, 'successful' do
        let(:school) { create(:school) }
        let(:user) { create(:user, school:) }
        let(:Authorization) { Accounts.encode_access_token(user) }
        let(:school_id) { school.id }

        before { create_list(:sensor, 3, school:) }

        run_test!
      end

      response 401, 'unauthorized' do
        let(:school_id) { create(:school).id }
        let(:Authorization) { '' }

        run_test!
      end

      response 403, 'forbidden' do
        let(:school) { create(:school) }
        let(:user) { create(:user, school:) }
        let(:school_id) { create(:school).id }
        let(:Authorization) { Accounts.encode_access_token(user) }

        run_test!
      end
    end
  end
end
