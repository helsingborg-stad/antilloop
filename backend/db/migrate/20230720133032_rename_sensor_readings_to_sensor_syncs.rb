class RenameSensorReadingsToSensorSyncs < ActiveRecord::Migration[7.0]
  def change
    rename_table :sensor_readings, :sensor_syncs
  end
end
