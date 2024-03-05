# frozen_string_literal: true

module Api
  module V1
    class SchoolSerializer < ApplicationSerializer
      property :id
      property :name
      property :logo_url, exec_context: :decorator
      property :main_color

      def logo_url
        represented.logo.url
      end
    end
  end
end
