# frozen_string_literal: true

module Api
  module V1
    module Workspace
      class SchoolIntegrationsController < WorkspaceController
        def create
          authorize school, :create_school_integration?, policy_class: WorkspacePolicy

          Integrations.create_school_integration(school, integration, school_integration_params) do |response|
            response.success do
              render(json: Api::V1::Workspace::SchoolIntegrationSerializer.new(response.data))
            end

            response.failure do
              handle_unprocessable_entity(response)
            end
          end
        end

        def update
          authorize school_integration.school, :update_school_integration?, policy_class: WorkspacePolicy

          Integrations.update_school_integration(school_integration, school_integration_params) do |response|
            response.success do
              render(json: Api::V1::Workspace::SchoolIntegrationSerializer.new(response.data))
            end

            response.failure do
              handle_unprocessable_entity(response)
            end
          end
        end

        def destroy
          authorize school_integration.school, :delete_school_integration?, policy_class: WorkspacePolicy

          Integrations.delete_school_integration(school_integration)

          render(json: { data: {} }, status: :ok)
        end

        private

        def school
          @school ||= Schools.get_school(params[:school_id])
        end

        def integration
          @integration ||= Integrations.get_integration_by_id(id: params[:integration_id])
        end

        def school_integration
          @school_integration ||= Integrations.get_school_integration_by_id(id: params[:id])
        end

        def school_integration_params
          params.require(:school_integration).permit(:status, settings: {})
        end
      end
    end
  end
end
