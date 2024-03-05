# frozen_string_literal: true

module Api
  module V1
    class SchoolHomePageController < ApplicationController
      include ActiveStorage::SetCurrent

      def show
        render(json: { data: school.home_page ? PageSerializer.new(school.home_page) : nil })
      end

      private

      def school
        @school ||= Schools.get_school(params[:school_id])
      end
    end
  end
end
