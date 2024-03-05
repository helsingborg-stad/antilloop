# frozen_string_literal: true

module Integrations
  module Oresundskraft
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
          school_integration_sync =
            school_integration.syncs.create(
              data: sync_data,
              value: sync_req.data,
              data_source_key: school_integration.key,
              reported_at: date,
              status: :success
            )

          Ducky.schedule_sync(school_integration_sync) if kwh.present?

          school_integration_sync
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
        @sync_req ||= Integrations::Oresundskraft::Req.call(school_integration)
      end

      def sync_data
        { kwh:, date: }
      end

      def kwh
        @kwh ||= reading_values.any? ? reading_values.sum.round(2) : nil
      end

      def reading_values
        @reading_values ||= reading.select { |reading| reading['unit'] == 'kWh' }
                                   .pluck('value')
                                   .compact_blank
      end

      def date
        reading_date = reading[0]&.dig('readingDate') || sync_req.data['date']

        Time.zone.parse(reading_date).utc.iso8601
      end

      def reading
        @reading ||= sync_req.data.dig('consumptions', 'reading') || []
      end
    end
  end
end
