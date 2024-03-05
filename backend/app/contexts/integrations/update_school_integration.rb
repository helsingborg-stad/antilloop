# frozen_string_literal: true

module Integrations
  class UpdateSchoolIntegration < Service
    def initialize(school_integration, params)
      @school_integration = school_integration
      @params = params
    end

    def call
      return errors!(form.errors) unless form.validate(params)

      form.sync
      form.model.save!

      data!(form.model)
    end

    private

    attr_reader :school_integration, :params

    def form
      @form ||= SchoolIntegrationForm.new(school_integration)
    end
  end
end
