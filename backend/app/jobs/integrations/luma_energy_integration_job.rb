# frozen_string_literal: true

module Integrations
  class LumaEnergyIntegrationJob < ApplicationJob
    queue_as :integrations

    after_perform do |_job|
      self.class.set(wait_until: Time.zone.tomorrow.midday.utc).perform_later
    end

    def perform
      SchoolIntegration
        .active
        .luma_energy
        .each do |school_integration|
          sync(school_integration)
        end
    end

    private

    def sync(school_integration)
      Integrations::LumaEnergy::Sync.call(school_integration)
    end
  end
end
