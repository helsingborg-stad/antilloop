# frozen_string_literal: true

module Integrations
  module Oresundskraft
    class Req < Service
      def initialize(school_integration)
        @school_integration = school_integration
      end

      def call
        @resp = conn.get(url)

        errors.add(:base, I18n.t('school_integration.errors.something_went_wrong')) unless @resp.success?

        resp_body = JSON.parse(@resp.body)
        consumptions = resp_body['consumptions']&.find do |consumption|
          consumption['meteringPoint'] == metering_point
        end

        data!({ 'consumptions' => consumptions, 'date' => from_date })
      rescue JSON::ParserError, Faraday::TimeoutError => _e
        errors.add(:base, I18n.t('school_integration.errors.something_went_wrong'))

        data!(@resp.body)
      end

      private

      attr_reader :school_integration

      def conn
        @conn ||= Faraday.new(params:, headers:, request:) do |f|
          f.adapter :typhoeus
        end
      end

      def url
        @url ||= school_integration.integration.url
      end

      def params
        {
          'fromDate' => from_date,
          'toDate' => Time.zone.today.to_s,
          'deliveryCategories' => 'EL',
          'offset' => 0,
          'maxRows' => 0,
          'customerNumbers' => school_integration.settings['customerNumber'],
          'subsidiary' => false
        }
      end

      def from_date
        Time.zone.yesterday.to_s
      end

      def headers
        {
          'Ocp-Apim-Subscription-Key' => school_integration.settings['Ocp-Apim-Subscription-Key'],
          'api-version' => '2.1'
        }
      end

      def request
        { timeout: 120 }
      end

      def metering_point
        @metering_point ||= school_integration.settings['meteringPoint']
      end
    end
  end
end
