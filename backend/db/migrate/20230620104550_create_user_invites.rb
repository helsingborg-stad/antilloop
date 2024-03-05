class CreateUserInvites < ActiveRecord::Migration[7.0]
  def change
    create_table :user_invites do |t|
      t.string :email, null: false
      t.string :status, default: 'pending'
      t.datetime :accepted_at
      t.references :school, null: false, foreign_key: true

      t.timestamps
    end
  end
end
