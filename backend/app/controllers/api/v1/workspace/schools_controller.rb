# frozen_string_literal: true

module Api
  module V1
    module Workspace
      class SchoolsController < WorkspaceController
        include ActiveStorage::SetCurrent

        def show
          authorize school, :show_school?, policy_class: WorkspacePolicy

          render(json: Api::V1::Workspace::SchoolSerializer.new(school))
        end

        def update
          authorize school, :update_school?, policy_class: WorkspacePolicy

          Schools.update_school(school, school_params) do |response|
            response.success do
              render(json: Api::V1::Workspace::SchoolSerializer.new(response.data))
            end

            response.failure do
              handle_unprocessable_entity(response)
            end
          end
        end

        private

        def school
          @school ||= Schools.get_school(params[:id])
        end

        def school_params
          params.require(:school).permit(:name, :main_color, :logo)
        end
      end
    end
  end
end
