# frozen_string_literal: true

module Api
  module V1
    class WidgetDataController < ApplicationController
      include ActiveStorage::SetCurrent

      def index
        data = Widgets.list_data(widget, params)

        render(json: {
                 data: Api::V1::WidgetDataSerializer.for_collection.new(data)
               })
      end

      private

      def widget
        Widgets.get_widget(params[:widget_id])
      end
    end
  end
end
