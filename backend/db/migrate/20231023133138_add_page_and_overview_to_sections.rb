class AddPageAndOverviewToSections < ActiveRecord::Migration[7.0]
  def change
    add_column :sections, :school_page, :boolean, default: true, null: false
    add_column :sections, :school_page_overview, :boolean, default: true, null: false
  end
end
