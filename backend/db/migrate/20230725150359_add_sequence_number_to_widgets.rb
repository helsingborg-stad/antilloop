class AddSequenceNumberToWidgets < ActiveRecord::Migration[7.0]
  def change
    add_column :widgets, :sn, :integer, null: false, default: 0
  end
end
