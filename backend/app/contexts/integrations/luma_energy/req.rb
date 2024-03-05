# frozen_string_literal: true

module Integrations
  module LumaEnergy
    class Req < Service
      def initialize(school_integration)
        @school_integration = school_integration
      end

      def call
        @resp = Faraday.get(url, q, headers)

        errors.add(:base, I18n.t('school_integration.errors.something_went_wrong')) unless @resp.success?

        data!(JSON.parse(@resp.body))
      rescue JSON::ParserError => _e
        errors.add(:base, I18n.t('school_integration.errors.something_went_wrong'))

        data!(@resp.body)
      end

      private

      attr_reader :school_integration

      def url
        @url ||= school_integration.integration.url
      end

      def q
        {
          'system_ids' => school_integration.settings['system_ids'],
          'resolution' => 'day',
          'from' => (Time.zone.today - 2.days).to_s,
          'to' => (Time.zone.today - 1.day).to_s,
          'multiple_value_types' => true
        }
      end

      def headers
        {
          'Authorization' => %(Api-Key #{school_integration.settings['api_key']})
        }
      end
    end
  end
end
