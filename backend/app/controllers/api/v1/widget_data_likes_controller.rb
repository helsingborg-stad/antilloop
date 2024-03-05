# frozen_string_literal: true

module Api
  module V1
    class WidgetDataLikesController < ApplicationController
      def create
        Likeable.add_like!(likeable)

        render(json: { data: Api::V1::WidgetDataSerializer.new(likeable) }, status: :created)
      end

      private

      def widget
        @widget ||= Widget.find(params[:widget_id])
      end

      def likeable
        @likeable ||= Widgets.get_widget_data(widget, params[:data_id])
      end
    end
  end
end
