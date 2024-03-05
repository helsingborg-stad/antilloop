# frozen_string_literal: true

class WorkspaceController < ApplicationController
  before_action :authorize_request

  private

  attr_reader :current_user

  def authorize_request
    jwt_payload = Accounts.decode_access_token(access_token)

    raise RequestUnauthorizedError if jwt_payload['user_id'].blank?

    @current_user = Accounts.get_user(jwt_payload['user_id'])
    @current_user.access_token = access_token
  end
end
