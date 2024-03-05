# frozen_string_literal: true

module Api
  module V1
    class WidgetSerializer < ApplicationSerializer
      property :id
      property :sn
      property :data_source_key
      property :active, exec_context: :decorator

      def active
        represented.active?
      end
    end
  end
end
