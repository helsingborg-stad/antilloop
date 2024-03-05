# frozen_string_literal: true

module Ducky
  class Api < Service
    def initialize(api_path, request_body)
      @api_path = api_path
      @request_body = request_body
    end

    def call
      return errors.add(:base, I18n.t('ducky.errors.something_went_wrong')) if access_token.blank?

      api_request

      errors.add(:base, I18n.t('ducky.errors.something_went_wrong')) unless api_request.success?

      data!(JSON.parse(api_request.body))
    rescue JSON::ParserError => _e
      errors.add(:base, I18n.t('ducky.errors.something_went_wrong'))

      data!(api_request.body)
    end

    private

    attr_reader :api_path, :request_body

    def api_request
      @api_request ||= conn.post(api_path, request_body.to_json, headers)
    end

    def headers
      {
        'Authorization' => "Bearer #{access_token}",
        'Content-Type' => 'application/json'
      }
    end

    def access_token
      @access_token ||= Ducky.access_token
    end

    def conn
      @conn ||= Faraday.new(url: Ducky::API_URL)
    end
  end
end
