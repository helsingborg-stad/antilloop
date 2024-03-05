# frozen_string_literal: true

module Api
  module V1
    class LikeSerializer < ApplicationSerializer
      property :id
      property :context
    end
  end
end
