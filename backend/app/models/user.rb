# frozen_string_literal: true

class User < ApplicationRecord
  belongs_to :school

  attr_accessor :access_token
end
