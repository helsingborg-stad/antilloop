class AddPageIdToWidgets < ActiveRecord::Migration[7.0]
  def change
    Widget.destroy_all
    add_reference :widgets, :page, null: false, foreign_key: true
  end
end
