# frozen_string_literal: true

module Api
  module V1
    class PageSerializer < ApplicationSerializer
      property :id
      property :name
      collection :sections, exec_context: :decorator, decorator: PageSectionSerializer
      collection :widgets, exec_context: :decorator, decorator: WidgetSerializer

      def sections
        represented.sections.school_page.includes(:active_widgets, widgets: :data_source)
      end

      def widgets
        represented.widgets_without_section.includes(:data_source)
      end
    end
  end
end
