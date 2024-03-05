# frozen_string_literal: true

module Api
  module V1
    class PageOverviewSerializer < ApplicationSerializer
      property :id
      property :name
      collection :sections, exec_context: :decorator, decorator: SectionOverviewSerializer

      def sections
        represented
          .sections
          .regular
          .includes(:active_widgets,
                    widgets: {
                      data_source_with_current_and_latest_data: %i[data current_data
                                                                   latest_data integration]
                    })
      end
    end
  end
end
