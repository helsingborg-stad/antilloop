class CreatePages < ActiveRecord::Migration[7.0]
  def change
    create_table :pages do |t|
      t.string :name
      t.references :school, null: false, foreign_key: true
      t.boolean :home_page, null: false, default: false

      t.timestamps
    end
  end
end
