class AddKeyToWidgets < ActiveRecord::Migration[7.0]
  def change
    add_column :widgets, :key, :string
  end
end
