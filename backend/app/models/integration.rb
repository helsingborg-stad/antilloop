# frozen_string_literal: true

class Integration < ApplicationRecord
  paginates_per 25

  has_one_attached :logo

  has_many :school_integrations, dependent: :destroy

  def sychronisable?
    settings.present? && url.present?
  end
end
