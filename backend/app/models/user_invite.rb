# frozen_string_literal: true

class UserInvite < ApplicationRecord
  belongs_to :school

  def pending?
    status == 'pending'
  end

  def accepted?
    status == 'accepted'
  end

  def accept!
    update!(status: 'accepted', accepted_at: Time.current)
  end
end
