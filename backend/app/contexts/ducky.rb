# frozen_string_literal: true

module Ducky
  module_function

  API_URL = 'https://api.ducky.eco/v3/'
  OAUTH_URL = 'https://ducky-prod.eu.auth0.com/oauth/token'

  def enabled?
    true
    # ENV['DUCKY_ENABLED'] == '1'
  end

  def access_token
    service = Ducky::GetAccessToken.call

    service.success? ? service.data : nil
  end

  def schedule_sync(school_integration_sync)
    return unless enabled?

    SyncJob.perform_later(school_integration_sync_id: school_integration_sync.id)
  end

  def sync(school_integration_sync)
    service = Sync.call(school_integration_sync)

    yield(service) if block_given?

    service
  end

  def convert_energy(params)
    service = Api.call('convert/energy', params)

    yield(service) if block_given?

    service
  end

  def translate_car(params)
    service = Api.call('translate/car', params)

    yield(service) if block_given?

    service
  end

  def translate_energy(params)
    service = Api.call('translate/energy', params)

    yield(service) if block_given?

    service
  end

  def translate_plane(params)
    service = Api.call('translate/plane', params)

    yield(service) if block_given?

    service
  end

  def translate_tree(params)
    service = Api.call('translate/tree', params)

    yield(service) if block_given?

    service
  end
end
