class CreateWidgets < ActiveRecord::Migration[7.0]
  def change
    create_table :widgets do |t|
      t.bigint  :data_source_id
      t.string  :data_source_type

      t.timestamps
    end

    add_index :widgets, [:data_source_type, :data_source_id]
  end
end