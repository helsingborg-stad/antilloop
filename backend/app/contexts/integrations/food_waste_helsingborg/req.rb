# frozen_string_literal: true

module Integrations
  module FoodWasteHelsingborg
    class Req < Service
      def initialize(school_integration)
        @school_integration = school_integration
      end

      def call
        @resp = Faraday.post(%(#{url}?#{q.to_query}))

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
          'enhetKod' => school_integration.settings['enhetKod'],
          'startDatum' => (Time.zone.today - 1.day).to_s,
          'slutDatum' => (Time.zone.today - 1.day).to_s
        }
      end
    end
  end
end
