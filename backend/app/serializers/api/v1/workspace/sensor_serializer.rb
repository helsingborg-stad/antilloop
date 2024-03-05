# frozen_string_literal: true

module Api
  module V1
    module Workspace
      class SensorSerializer < ApplicationSerializer
        property :name
        property :device
        property :location
        property :status
        property :battery_level
        property :battery_level_pct
      end
    end
  end
end
