# frozen_string_literal: true

module Api
  module V1
    class SchoolHomePageOverviewController < ApplicationController
      def show
        render(json: { data: school.home_page ? PageOverviewSerializer.new(school.home_page) : nil })
      end

      private

      def school
        @school ||= Schools.get_school(params[:school_id])
      end
    end
  end
end
