class CreateSensorReadings < ActiveRecord::Migration[7.0]
  def change
    create_table :sensor_readings do |t|
      t.jsonb :payload, default: {}
      t.references :sensor, null: false, foreign_key: true

      t.timestamps
    end
  end
end
