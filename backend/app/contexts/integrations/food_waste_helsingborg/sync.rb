# frozen_string_literal: true

module Integrations
  module FoodWasteHelsingborg
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
          school_integration.syncs.create(
            data: sync_data,
            value: sync_req.data,
            data_source_key: school_integration.key,
            reported_at:,
            status: :success
          )
        else
          school_integration.syncs.create(
            value: sync_req.data,
            data_source_key: school_integration.key,
            status: :failure
          )
        end
      end
      # rubocop:enable Metrics/MethodLength

      def sync_req
        @sync_req ||= Integrations::FoodWasteHelsingborg::Req.call(school_integration)
      end

      def sync_data
        {
          waste_in_g:,
          waste_in_g_per_person:,
          attendees_count:,
          date: (date || reported_at)
        }
      end

      def waste_in_g
        return nil if results.empty?

        sync_req.data['results'][0]['koksSvinnGram']
      end

      def waste_in_g_per_person
        return nil if waste_in_g.blank?
        return nil if attendees_count.blank? || attendees_count.zero?

        (waste_in_g.to_f / attendees_count).round(2)
      end

      def attendees_count
        return nil if results.empty?

        sync_req.data['results'][0]['antalAtande']
      end

      def date
        return nil if results.empty?

        Time.zone.parse(sync_req.data['results'][0]['datum']).utc.iso8601
      end

      def results
        sync_req.data['results']
      end

      def reported_at
        date || (Time.zone.now.utc.beginning_of_day - 1.day).iso8601
      end
    end
  end
end
