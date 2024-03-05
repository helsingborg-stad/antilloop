# frozen_string_literal: true

module Api
  module V1
    class WidgetDataSerializer < ApplicationSerializer
      property :id
      property :data
      property :likes_count, exec_context: :decorator
      property :created_at, exec_context: :decorator
      property :assoc_data, exec_context: :decorator
      property :ducky, exec_context: :decorator

      def likes_count
        represented.likes_count if represented.respond_to?(:likes_count)
      end

      def created_at
        represented.created_at.iso8601
      end

      def assoc_data
        return unless represented.respond_to?(:assoc_data)

        represented.assoc_data.compact.map do |data|
          {
            id: data['id'],
            data: data['data'],
            data_source_key: data['data_source_key']
          }
        end
      end

      def ducky
        return unless represented.respond_to?(:ducky)

        represented.ducky
      end
    end
  end
end
