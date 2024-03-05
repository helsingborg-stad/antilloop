class RenameSensorReadingsPayloadToValue < ActiveRecord::Migration[7.0]
  def change
    rename_column :sensor_readings, :payload, :value
  end
end
