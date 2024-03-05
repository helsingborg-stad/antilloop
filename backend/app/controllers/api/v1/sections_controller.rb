# frozen_string_literal: true

module Api
  module V1
    class SectionsController < ApplicationController
      def show
        render(json: { data: Api::V1::SectionSerializer.new(section) })
      end

      private

      def page
        @page ||= Pages.get_page(params[:page_id])
      end

      def section
        @section ||= Pages.get_section(page, params[:id])
      end
    end
  end
end
