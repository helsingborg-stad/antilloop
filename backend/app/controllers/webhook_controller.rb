# frozen_string_literal: true

class WebhookController < ApplicationController
  before_action :authorize_request

  rescue_from ActionController::ParameterMissing, with: :handle_parameter_missing

  private

  attr_reader :current_school, :current_context

  def authorize_request
    jwt_payload = Webhook.decode_access_token(access_token)

    raise RequestUnauthorizedError if jwt_payload['school_id'].blank?

    @current_school = Schools.get_school(jwt_payload['school_id'])

    jwt_payload
  end

  def authorize_global_sensor_request
    jwt_payload = Webhook.decode_access_token(access_token)

    raise RequestUnauthorizedError if jwt_payload['external_id'].blank?

    @current_context = jwt_payload.with_indifferent_access

    jwt_payload
  end

  def handle_parameter_missing(exception)
    Sentry.capture_message(exception.message, level: :warning)

    render(json: { message: exception.message }, status: :bad_request)
  end
end
