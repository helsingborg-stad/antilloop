class CreateSchoolIntegrationSyncs < ActiveRecord::Migration[7.0]
  def change
    create_table :school_integration_syncs do |t|
      t.references :school_integration, null: false, foreign_key: true
      t.jsonb :data, default: {}
      t.integer :status, default: 0

      t.timestamps
    end
  end
end
