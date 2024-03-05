# frozen_string_literal: true

module Api
  module V1
    class PaginationSerializer < ApplicationSerializer
      property :total_count
      property :total_pages
      property :current_page
      property :next_page
      property :prev_page
    end
  end
end
