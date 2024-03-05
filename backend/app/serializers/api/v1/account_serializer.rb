# frozen_string_literal: true

module Api
  module V1
    class AccountSerializer < ApplicationSerializer
      property :name
      property :email
      property :access_token
      property :school, exec_context: :decorator, decorator: SchoolSerializer

      delegate :school, to: :represented
    end
  end
end
