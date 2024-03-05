# frozen_string_literal: true

class UserAccountForm < Reform::Form
  property :email
  property :name
  property :user_school_name, virtual: true

  validates :email, presence: true
  validates :name, presence: true

  validate :email_uniqueness
  validate :user_invite_presence

  def email_uniqueness
    return unless Accounts.get_user_by_email(email:)

    errors.add(:email, I18n.t('account.errors.email_is_already_taken'))
  end

  def user_invite_presence
    return if user_school_name.present?
    return if Accounts.get_user_invite_by_email(email:)

    errors.add(:base, I18n.t('account.errors.user_invite_not_found'))
  end
end
