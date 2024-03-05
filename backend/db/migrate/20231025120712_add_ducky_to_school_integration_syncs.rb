class AddDuckyToSchoolIntegrationSyncs < ActiveRecord::Migration[7.0]
  def change
    add_column :school_integration_syncs, :ducky, :jsonb, default: {}
  end
end
