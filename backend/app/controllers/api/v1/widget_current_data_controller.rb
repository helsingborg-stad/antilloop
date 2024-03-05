# frozen_string_literal: true

module Api
  module V1
    class WidgetCurrentDataController < ApplicationController
      include ActiveStorage::SetCurrent

      def show
        current_data = Widgets.current_data(widget)

        render(json: {
                 data: current_data ? Api::V1::WidgetDataSerializer.new(current_data) : nil
               })
      end

      private

      def widget
        Widgets.get_widget(params[:widget_id])
      end
    end
  end
end
