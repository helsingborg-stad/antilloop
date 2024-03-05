class AddIndexToReportedAt < ActiveRecord::Migration[7.0]
  def change
    add_index :school_integration_syncs, :reported_at
    add_index :sensor_syncs, :reported_at
  end
end
