# frozen_string_literal: true

class ApplicationController < ActionController::API
  include Pundit::Authorization

  class RequestUnauthorizedError < StandardError; end

  class ResponseError
    include ActiveModel::Serializers::JSON

    attr_reader :message, :errors

    def initialize(errors, message = I18n.t('api.errors.something_went_wrong'))
      @errors = errors
      @message = message
    end

    def as_json(_arg)
      {
        message:,
        errors: errors.reduce([]) { |memo, (pointer, messages)| memo + source_errors(pointer, messages) }
      }
    end

    private

    def source_errors(pointer, messages)
      messages.map do |message|
        {
          source: { pointer: },
          message:
        }
      end
    end
  end

  unless Rails.env.production?
    around_action :n_plus_one_detection

    def n_plus_one_detection
      Prosopite.scan
      yield
    ensure
      Prosopite.finish
    end
  end

  before_action :set_locale

  rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found
  rescue_from I18n::InvalidLocale, with: :handle_invalid_locale
  rescue_from JWT::VerificationError, with: :handle_unauthorized
  rescue_from JWT::DecodeError, with: :handle_unauthorized
  rescue_from RequestUnauthorizedError, with: :handle_unauthorized
  rescue_from Pundit::NotAuthorizedError, with: :handle_forbidden

  def route_not_found
    render(json: { message: I18n.t('api.errors.not_found') }, status: :not_found)
  end

  private

  def access_token
    @access_token ||= request.headers['Authorization'] || params['access_token']
  end

  def set_locale
    I18n.locale = params[:locale] if params[:locale]
  end

  def handle_invalid_locale
    render(json: { message: I18n.t('api.errors.invalid_locale') }, status: :unprocessable_entity)
  end

  def handle_unprocessable_entity(response)
    error = ResponseError.new(response.errors.messages, I18n.t('api.errors.unprocessable_entity'))

    render(json: error, status: :unprocessable_entity)
  end

  def handle_record_not_found
    render(json: { message: I18n.t('api.errors.not_found') }, status: :not_found)
  end

  def handle_unauthorized
    render(json: { message: I18n.t('api.errors.unauthorized') }, status: :unauthorized)
  end

  def handle_forbidden
    render(json: { message: I18n.t('api.errors.forbidden') }, status: :forbidden)
  end
end
