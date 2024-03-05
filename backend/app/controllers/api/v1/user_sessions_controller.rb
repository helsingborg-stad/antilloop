# frozen_string_literal: true

module Api
  module V1
    class UserSessionsController < ApplicationController
      include ActiveStorage::SetCurrent

      def create
        Accounts.sign_in(session_params) do |response|
          response.success do
            render(json: { data: Api::V1::AccountSerializer.new(response.data) })
          end

          response.failure do
            handle_unprocessable_entity(response)
          end
        end
      end

      private

      def session_params
        params.permit(%i[email name])
      end
    end
  end
end
