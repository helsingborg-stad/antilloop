# frozen_string_literal: true

module Api
  module V1
    class WidgetLatestDataController < ApplicationController
      include ActiveStorage::SetCurrent

      def show
        latest_data = Widgets.latest_present_data(widget)

        render(json: {
                 data: latest_data ? Api::V1::WidgetDataSerializer.new(latest_data) : nil
               })
      end

      private

      def widget
        Widgets.get_widget(params[:widget_id])
      end
    end
  end
end
