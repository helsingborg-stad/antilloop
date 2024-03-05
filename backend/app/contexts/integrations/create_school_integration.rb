# frozen_string_literal: true

module Integrations
  class CreateSchoolIntegration < Service
    include Wisper::Publisher

    def initialize(school, integration, params = {}, opts = {})
      @school = school
      @integration = integration
      @params = params
      @opts = opts
    end

    def call
      return errors!(form.errors) unless form.validate(params.merge(status: 1))

      form.sync
      form.model.status = :active
      form.model.save!

      broadcast(:school_integration_created, school_id: school.id, school_integration_id: form.model.id) if broadcast?

      data!(form.model)
    end

    private

    attr_reader :school, :integration, :params, :opts

    def form
      @form ||= SchoolIntegrationForm.new(SchoolIntegration.new(school:, integration:))
    end

    def broadcast?
      opts.fetch(:broadcast, true)
    end
  end
end
