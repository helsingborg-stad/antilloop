class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :email, index: { unique: true }
      t.string :name
      t.references :school, null: false, foreign_key: true

      t.timestamps
    end
  end
end
