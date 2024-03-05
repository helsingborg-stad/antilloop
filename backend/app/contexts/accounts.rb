# frozen_string_literal: true

module Accounts
  module_function

  JWT_HMAC_SECRET = Rails.application.credentials.jwt_hmac_secret
  JWT_HASH_ALGORITHM = 'HS256'
  JWT_VERIFY = true
  JWT_DECODE_OPTS = { algorithm: JWT_HASH_ALGORITHM }.freeze

  def create_user_account(params)
    service = CreateUserAccount.call(params)

    yield(service) if block_given?

    service
  end

  def delete_user_account(user)
    service = DeleteUserAccount.call(user)

    yield(service) if block_given?

    service
  end

  def get_user(id) = User.find(id)

  def get_user_by_email(email:) = User.find_by(email:)

  def get_user_invite_by_email(email:)
    UserInvite.find_by(email:)
  end

  def create_user_invite(params)
    service = CreateUserInvite.call(params)

    yield(service) if block_given?

    service
  end

  def sign_in(params)
    service = SignIn.call(params)

    yield(service) if block_given?

    service
  end

  def assign_access_token(user)
    user.access_token = encode_access_token(user)
  end

  def encode_access_token(user)
    JWT.encode({ user_id: user.id }, JWT_HMAC_SECRET, JWT_HASH_ALGORITHM)
  end

  def decode_access_token(access_token)
    payload, = JWT.decode(access_token, JWT_HMAC_SECRET, JWT_VERIFY, JWT_DECODE_OPTS)
    payload
  end
end
