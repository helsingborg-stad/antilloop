class DropColumnSyncErrorsInSchoolIntegrationSyncs < ActiveRecord::Migration[7.0]
  def change
    remove_column :school_integration_syncs, :sync_errors, :jsonb
  end
end
