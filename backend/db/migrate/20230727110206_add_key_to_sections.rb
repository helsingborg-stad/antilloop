class AddKeyToSections < ActiveRecord::Migration[7.0]
  def change
    add_column :sections, :key, :string
  end
end
