# frozen_string_literal: true

module Accounts
  class SignIn < Service
    def initialize(params)
      @params = params
    end

    def call
      return errors!(form.errors) unless form.validate(params)

      find_or_create_user(params)

      return errors.add(:base, I18n.t('account.errors.does_not_exist')) unless user

      assign_access_token

      data!(user)
    end

    private

    attr_reader :params

    def form
      @form ||= SignInForm.new(User.new)
    end

    def find_or_create_user(params)
      return if user.present?

      service = Accounts.create_user_account(params)

      @user = service.data
    end

    def assign_access_token
      Accounts.assign_access_token(user)
    end

    def user
      @user ||= Accounts.get_user_by_email(email:)
    end

    def email
      params[:email]&.downcase
    end
  end
end
