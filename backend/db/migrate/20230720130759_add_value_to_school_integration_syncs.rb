class AddValueToSchoolIntegrationSyncs < ActiveRecord::Migration[7.0]
  def change
    add_column :school_integration_syncs, :value, :jsonb
  end
end
