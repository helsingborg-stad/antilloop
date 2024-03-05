# frozen_string_literal: true

module Integrations
  module SchoolFoodMenu
    class Sync < Service
      def initialize(school_integration)
        @school_integration = school_integration
      end

      def call
        data!(sync)
      end

      private

      attr_reader :school_integration

      # rubocop:disable Metrics/MethodLength
      def sync
        if sync_req.success?
          sync_data.map do |day|
            school_integration_sync = find_or_create_by(day).tap do |sync|
              sync.data = {
                date: Time.zone.at(day['date']).utc.iso8601,
                items: day['items'] || []
              }
            end
            school_integration_sync.reported_at = Time.zone.at(day['date']).utc.iso8601
            school_integration_sync.save!
            school_integration_sync
          end
        else
          school_integration.syncs.create(
            value: sync_req.data,
            status: :failure,
            data_source_key: school_integration.key
          )
        end
      end
      # rubocop:enable Metrics/MethodLength

      def sync_req
        @sync_req ||= Integrations::SchoolFoodMenu::Req.call(school_integration)
      end

      def find_or_create_by(value)
        school_integration
          .syncs
          .where("value->>'date' = ?", value['date'].to_s)
          .success
          .first_or_create!(value:, status: :success, data_source_key: school_integration.key)
      end

      def sync_data
        sync_req.data['weeks'].map do |week|
          week['days'].map do |day|
            day
          end
        end.flatten
      end
    end
  end
end
