# frozen_string_literal: true

class SchoolIntegrationForm < Reform::Form
  property :status, default: 'active'
  property :settings, default: {}

  validate :settings_presence
  validate :settings_are_valid

  def settings_presence
    return if model.integration.settings.empty?

    model.integration.settings.all? do |(key, _)|
      errors.add(:settings, I18n.t('school_integration.errors.settings_are_not_valid')) if settings[key].blank?
    end
  end

  def settings_are_valid
    return if status == 'inactive'
    return unless model.integration.sychronisable?
    return if errors.any?

    sync && service = Integrations::Req.call(model)

    errors.add(:settings, I18n.t('school_integration.errors.something_went_wrong')) if service.failure?
  end
end
