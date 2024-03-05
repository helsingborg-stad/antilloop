class AddLocationAndDeviceToSensors < ActiveRecord::Migration[7.0]
  def change
    add_column :sensors, :location, :string
    add_column :sensors, :device, :string
  end
end
