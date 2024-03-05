class CreateIntegrations < ActiveRecord::Migration[7.0]
  def change
    create_table :integrations do |t|
      t.string :name
      t.string :key
      t.string :url
      t.jsonb :settings, default: {}

      t.timestamps
    end
  end
end
