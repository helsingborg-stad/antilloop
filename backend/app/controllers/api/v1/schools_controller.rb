# frozen_string_literal: true

module Api
  module V1
    class SchoolsController < ApplicationController
      include ActiveStorage::SetCurrent

      def index
        schools = Schools.list_schools

        render(json: { data: Api::V1::SchoolSerializer.for_collection.new(schools) })
      end

      def show
        school = Schools.get_school(params[:id])

        render(json: { data: Api::V1::SchoolSerializer.new(school) })
      end
    end
  end
end
