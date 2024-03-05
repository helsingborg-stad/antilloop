class RenameKeyToThemeInSections < ActiveRecord::Migration[7.0]
  def change
    rename_column :sections, :key, :theme
  end
end
