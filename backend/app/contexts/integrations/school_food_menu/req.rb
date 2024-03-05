# frozen_string_literal: true

module Integrations
  module SchoolFoodMenu
    class Req < Service
      def initialize(school_integration)
        @school_integration = school_integration
      end

      def call
        @resp = Faraday.get(url, q)

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
          'school' => school_integration.settings['school'],
          'client' => school_integration.settings['client'],
          'limit' => 3,
          'offset' => -1
        }
      end
    end
  end
end
