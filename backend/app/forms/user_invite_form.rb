# frozen_string_literal: true

class UserInviteForm < Reform::Form
  property :email
  property :school

  validates :email, presence: true
  validates :school, presence: true
end
