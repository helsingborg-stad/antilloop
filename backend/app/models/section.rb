# frozen_string_literal: true

class Section < ApplicationRecord
  belongs_to :page

  has_many :widgets, -> { order(sn: :asc) }, dependent: :destroy, inverse_of: :section
  has_many :active_widgets, lambda {
                              active.order(sn: :asc)
                            }, class_name: 'Widget', dependent: :destroy, inverse_of: :section

  scope :regular, -> { where.not(link: true) }
  scope :link, -> { where(link: true) }
  scope :school_page_overview, -> { where(school_page_overview: true) }
  scope :school_page, -> { where(school_page: true) }
  scope :wo_widgets, -> { where.missing(:widgets) }

  def active?
    active_widgets.any?
  end
end
