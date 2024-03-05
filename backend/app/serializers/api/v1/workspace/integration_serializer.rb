# frozen_string_literal: true

module Api
  module V1
    module Workspace
      class IntegrationSerializer < ApplicationSerializer
        def initialize(integration, options = {})
          @options = options
          super(integration)
        end

        attr_reader :options

        property :id
        property :name
        property :key
        property :logo_url, exec_context: :decorator
        property :url
        property :settings
        collection :school_integrations, exec_context: :decorator,
                                         decorator: Api::V1::Workspace::SchoolIntegrationSerializer

        def logo_url
          represented.logo.url
        end

        def school_integrations
          options[:school_integrations] || []
        end
      end
    end
  end
end
