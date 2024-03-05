class AddReportedAtToSensorSyncs < ActiveRecord::Migration[7.0]
  def change
    add_column :sensor_syncs, :reported_at, :datetime
  end
end
