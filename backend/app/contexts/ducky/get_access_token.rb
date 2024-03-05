# frozen_string_literal: true

module Ducky
  class GetAccessToken < Service
    def call
      data!(access_token)
    end

    private

    def access_token
      access_token =
        Rails.cache.fetch('ducky_access_token', expires_in: 1.hour) do
          exchange_credentials_request

          errors.add(:base, I18n.t('ducky.errors.something_went_wrong')) unless exchange_credentials_request.success?

          JSON.parse(exchange_credentials_request.body)['access_token']
        end

      data!(access_token)
    rescue JSON::ParserError => _e
      errors.add(:base, I18n.t('ducky.errors.something_went_wrong'))

      data!(exchange_credentials_request.body)
    end

    def exchange_credentials_request
      @exchange_credentials_request ||=
        Faraday.post(Ducky::OAUTH_URL,
                     { client_id:, client_secret:, audience:, grant_type: }.to_json,
                     { 'Content-Type' => 'application/json' })
    end

    def client_id
      Rails.application.credentials.ducky[:client_id]
    end

    def client_secret
      Rails.application.credentials.ducky[:client_secret]
    end

    def audience
      'ducky-api-prod'
    end

    def grant_type
      'client_credentials'
    end
  end
end
