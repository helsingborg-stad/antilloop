class AddLikesCountSchoolIntegrationSyncs < ActiveRecord::Migration[7.0]
  def change
    add_column :school_integration_syncs, :likes_count, :integer, default: 0
  end
end
