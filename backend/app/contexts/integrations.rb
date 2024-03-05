# frozen_string_literal: true

module Integrations
  module_function

  def list_integrations
    Integration.all.order(:name)
  end

  def list_school_integrations(school)
    SchoolIntegration.where(school:)
  end

  def get_integration_by_id(id:)
    Integration.find(id)
  end

  def get_school_integration_by_id(id:)
    SchoolIntegration.find(id)
  end

  def get_school_integration_sync(id)
    SchoolIntegrationSync.find(id)
  end

  def create_school_integration(school, integration, params = {}, opts = {})
    service = CreateSchoolIntegration.call(school, integration, params, opts)

    yield(service) if block_given?

    service
  end

  def update_school_integration(school_integration, params = {})
    service = UpdateSchoolIntegration.call(school_integration, params)

    yield(service) if block_given?

    service
  end

  def delete_school_integration(school_integration)
    school_integration.destroy!
  end

  def disable_school_integration(school_integration)
    school_integration.update!(status: :inactive)
  end

  def enable_school_integration(school_integration)
    school_integration.update!(status: :active)
  end
end
