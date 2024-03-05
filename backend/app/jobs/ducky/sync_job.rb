# frozen_string_literal: true

module Ducky
  class SyncJob < ApplicationJob
    queue_as :ducky

    def perform(school_integration_sync_id:)
      school_integration_sync = Integrations.get_school_integration_sync(school_integration_sync_id)
      ducky_sync = Ducky.sync(school_integration_sync)

      school_integration_sync.update(ducky: ducky_sync.data) if ducky_sync.success?
    end
  end
end
