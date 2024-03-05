# frozen_string_literal: true

module Api
  module V1
    class WidgetOverviewSerializer < ApplicationSerializer
      property :id
      property :sn
      property :data_source_key
      property :active, exec_context: :decorator
      property :latest_data, exec_context: :decorator
      property :current_data, exec_context: :decorator
      property :data_source_url, exec_context: :decorator

      def active
        represented.data_source_with_current_and_latest_data&.active?
      end

      def latest_data
        represented.data_source_with_current_and_latest_data&.latest_data&.data
      end

      def current_data
        represented.data_source_with_current_and_latest_data&.current_data&.data
      end

      def data_source_url
        return nil unless represented.data_source_type == 'SchoolIntegration'

        represented.data_source_with_current_and_latest_data&.integration&.url
      end
    end
  end
end
