class AddErrorsToSchoolIntegrationSyncs < ActiveRecord::Migration[7.0]
  def change
    add_column :school_integration_syncs, :sync_errors, :jsonb
  end
end
