# frozen_string_literal: true

class School < ApplicationRecord
  has_one_attached :logo

  has_many :users, dependent: :destroy
  has_many :sensors, dependent: :destroy
  has_many :school_integrations, dependent: :destroy
  has_many :pages, dependent: :destroy
  has_many :sections, through: :pages
  has_many :widgets, through: :pages

  def home_page
    pages.find_by(home_page: true)
  end
end
