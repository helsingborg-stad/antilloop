# frozen_string_literal: true

module Api
  module V1
    module Workspace
      class SensorsController < WorkspaceController
        def index
          authorize school, :list_sensors?, policy_class: WorkspacePolicy

          sensors = Sensors
                    .list_sensors(school)
                    .page(params[:page] || 1)
                    .per(params[:per_page] || Sensor.default_per_page)

          render(json: {
                   data: Api::V1::Workspace::SensorSerializer.for_collection.new(sensors),
                   meta: Api::V1::PaginationSerializer.new(sensors)
                 })
        end

        private

        def school
          @school ||= Schools.get_school(params[:school_id])
        end
      end
    end
  end
end
