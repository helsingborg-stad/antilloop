# frozen_string_literal: true

module Api
  module V1
    module Workspace
      class SchoolSerializer < ApplicationSerializer
        property :id
        property :name
        property :logo_url, exec_context: :decorator
        property :main_color
        property :webhook_url, exec_context: :decorator

        def logo_url
          represented.logo.url
        end

        def webhook_url
          ::Webhook.webhook_url(represented)
        end
      end
    end
  end
end
