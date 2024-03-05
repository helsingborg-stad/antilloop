class AddValueHasToSensorReadings < ActiveRecord::Migration[7.0]
  def change
    add_column :sensor_readings, :data, :jsonb, default: {}
  end
end
