class AddSequenceNumberToSections < ActiveRecord::Migration[7.0]
  def change
    add_column :sections, :sn, :integer, null: false, default: 0
  end
end
