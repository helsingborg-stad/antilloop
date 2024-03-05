class AddSectionIdToWidgets < ActiveRecord::Migration[7.0]
  def change
    add_reference :widgets, :section, foreign_key: true
  end
end
