# frozen_string_literal: true

module Accounts
  class CreateUserInvite < Service
    def initialize(params)
      @params = params
    end

    def call
      return errors!(form.errors) unless form.validate(params)

      form.sync
      form.model.email.downcase!
      form.model.save!

      data!(form.model)
    end

    private

    attr_reader :params

    def form
      @form ||= UserInviteForm.new(UserInvite.new)
    end
  end
end
