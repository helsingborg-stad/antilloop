class AddReportedAtToSchoolIntegrationSyncs < ActiveRecord::Migration[7.0]
  def change
    add_column :school_integration_syncs, :reported_at, :datetime
  end
end
