# frozen_string_literal: true

module Accounts
  class CreateUserAccount < Service
    def initialize(params)
      @params = params
    end

    def call
      return errors!(form.errors) unless form.validate(params.merge(user_school_name:, email:))

      ActiveRecord::Base.transaction do
        save_user!
        accept_user_invite! if user_invite.present?
      end

      data!(form.model)
    rescue ActiveRecord::StatementInvalid
      errors.add(:base, I18n.t('account.errors.can_not_create_account'))
    end

    private

    attr_reader :params

    def form
      @form ||= UserAccountForm.new(User.new)
    end

    def save_user!
      form.sync
      form.model.school = school || user_invite.school
      form.model.save!
    end

    def accept_user_invite!
      user_invite.accept!
    end

    def user_invite
      @user_invite ||= Accounts.get_user_invite_by_email(email:)
    end

    def email
      params[:email]&.downcase
    end

    def name
      params[:name]
    end

    def user_school_name
      return if email.blank?
      return unless /\A\w{4}\d{4}@/.match?(email)

      school&.name
    end

    def school
      return if name.blank?

      @school ||= School.find_by('? ~ LOWER(name)', name.downcase)
    end
  end
end
