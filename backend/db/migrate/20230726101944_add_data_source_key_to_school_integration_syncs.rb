class AddDataSourceKeyToSchoolIntegrationSyncs < ActiveRecord::Migration[7.0]
  def change
    add_column :school_integration_syncs, :data_source_key, :string, null: false, default: ''
    add_index :school_integration_syncs, :data_source_key
  end
end
