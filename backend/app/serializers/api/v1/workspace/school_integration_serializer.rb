# frozen_string_literal: true

module Api
  module V1
    module Workspace
      class SchoolIntegrationSerializer < ApplicationSerializer
        property :id
        property :status
        property :settings
      end
    end
  end
end
