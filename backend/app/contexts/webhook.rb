# frozen_string_literal: true

module Webhook
  module_function

  JWT_HMAC_SECRET = Rails.application.credentials.jwt_hmac_secret
  JWT_HASH_ALGORITHM = 'HS256'
  JWT_VERIFY = true
  JWT_DECODE_OPTS = { algorithm: JWT_HASH_ALGORITHM }.freeze

  def encode_access_token(client, school)
    JWT.encode({ client:, school_id: school.id }, JWT_HMAC_SECRET, JWT_HASH_ALGORITHM)
  end

  def decode_access_token(access_token)
    payload, = JWT.decode(access_token, JWT_HMAC_SECRET, JWT_VERIFY, JWT_DECODE_OPTS)
    payload
  end

  def webhook_url(school)
    Rails.application.routes.url_helpers.api_v1_webhook_sensors_url(protocol: 'https') +
      "?access_token=#{Webhook.encode_access_token('helsingborg', school)}"
  end

  def encode_global_sensor_access_token(name:, device:, location:, external_id: SecureRandom.uuid)
    JWT.encode({ external_id:, name:, device:, location: }, JWT_HMAC_SECRET, JWT_HASH_ALGORITHM)
  end

  def global_sensor_webhook_url(name:, device:, location:, external_id: SecureRandom.uuid)
    Rails.application.routes.url_helpers.api_v1_webhook_global_sensors_url(protocol: 'https') +
      "?access_token=#{Webhook.encode_global_sensor_access_token(external_id:, name:, device:, location:)}"
  end
end
