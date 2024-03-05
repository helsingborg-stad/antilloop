# frozen_string_literal: true

class SignInForm < Reform::Form
  property :email

  validates :email, presence: true
end
