class CreateSchoolIntegrations < ActiveRecord::Migration[7.0]
  def change
    create_table :school_integrations do |t|
      t.references :integration, null: false, foreign_key: true
      t.references :school, null: false, foreign_key: true
      t.integer :status, default: 0
      t.jsonb :settings

      t.timestamps
    end
  end
end
