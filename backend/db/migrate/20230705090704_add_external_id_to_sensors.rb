class AddExternalIdToSensors < ActiveRecord::Migration[7.0]
  def change
    add_column :sensors, :external_id, :string
  end
end
