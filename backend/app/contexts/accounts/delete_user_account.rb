# frozen_string_literal: true

module Accounts
  class DeleteUserAccount < Service
    def initialize(user)
      @user = user
    end

    def call
      user.destroy!
      user_invite&.destroy!

      data!(user)
    end

    private

    attr_reader :user

    def user_invite
      @user_invite ||= Accounts.get_user_invite_by_email(email: user.email)
    end
  end
end
