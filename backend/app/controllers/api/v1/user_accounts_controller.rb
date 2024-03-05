# frozen_string_literal: true

module Api
  module V1
    class UserAccountsController < WorkspaceController
      include ActiveStorage::SetCurrent

      def show
        render(json: { data: Api::V1::AccountSerializer.new(current_user) })
      end
    end
  end
end
