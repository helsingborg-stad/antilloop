# frozen_string_literal: true

module Integrations
  class Req < Service
    def initialize(school_integration)
      @school_integration = school_integration
    end

    def call
      service = integration_req_service.call(school_integration)

      if service.success?
        data!(service.data)
      else
        errors!(service.errors)
      end
    end

    private

    attr_reader :school_integration

    def integration_req_service
      %(Integrations::#{integration_key.camelize}::Req).constantize
    end

    def integration_key
      school_integration.integration.key
    end
  end
end
