class AddNameToWidgets < ActiveRecord::Migration[7.0]
  def change
    add_column :widgets, :name, :string
  end
end
