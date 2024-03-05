class CreateSensors < ActiveRecord::Migration[7.0]
  def change
    create_table :sensors do |t|
      t.string :name
      t.integer :status, default: 0
      t.string :battery_level
      t.references :school, null: false, foreign_key: true

      t.timestamps
    end
  end
end
