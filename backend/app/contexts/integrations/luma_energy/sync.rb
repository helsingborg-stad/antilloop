# frozen_string_literal: true

module Integrations
  module LumaEnergy
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
            reported_at: date,
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
        @sync_req ||= Integrations::LumaEnergy::Req.call(school_integration)
      end

      def sync_data
        { kwh:, date: }
      end

      def kwh
        w = sync_req.data['result'][0]['data'][0]['relative'][0]

        w ? w * 0.001 : w
      end

      def date
        Time.zone.parse(sync_req.data['result'][0]['data'][0]['time_utc'][0]).utc.iso8601
      end
    end
  end
end
