# frozen_string_literal: true

module Api
  module V1
    class SectionSerializer < ApplicationSerializer
      property :id
      property :name, exec_context: :decorator
      property :sn
      property :link
      property :theme
      property :active, exec_context: :decorator
      collection :widgets, exec_context: :decorator, decorator: WidgetSerializer

      def name
        represented.theme.present? ? I18n.t("section.#{represented.theme}.name") : represented.name
      end

      def active
        represented.active?
      end

      def widgets
        represented.widgets.includes(:data_source)
      end
    end
  end
end
