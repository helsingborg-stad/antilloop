# frozen_string_literal: true

module Api
  module V1
    module Workspace
      class IntegrationsController < WorkspaceController
        # rubocop:disable Metrics/MethodLength
        def index
          authorize school, :list_integrations?, policy_class: WorkspacePolicy

          integrations = Integrations
                         .list_integrations
                         .with_attached_logo
                         .page(params[:page] || 1)
                         .per(params[:per_page] || Integration.default_per_page)
          school_integrations = Integrations.list_school_integrations(school).group_by(&:integration_id)

          render(json: {
                   data: integrations.map do |integration|
                     Api::V1::Workspace::IntegrationSerializer.new(
                       integration,
                       school_integrations: school_integrations[integration.id]
                     )
                   end,
                   meta: Api::V1::PaginationSerializer.new(integrations)
                 })
        end
        # rubocop:enable Metrics/MethodLength

        private

        def school
          @school ||= Schools.get_school(params[:school_id])
        end
      end
    end
  end
end
