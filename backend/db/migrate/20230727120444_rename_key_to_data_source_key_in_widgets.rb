class RenameKeyToDataSourceKeyInWidgets < ActiveRecord::Migration[7.0]
  def change
    rename_column :widgets, :key, :data_source_key
  end
end
