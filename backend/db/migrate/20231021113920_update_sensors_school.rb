class UpdateSensorsSchool < ActiveRecord::Migration[7.0]
  def change
    change_column :sensors, :school_id, :integer, null: true
  end
end
