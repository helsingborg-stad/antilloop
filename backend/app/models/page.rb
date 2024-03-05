# frozen_string_literal: true

class Page < ApplicationRecord
  belongs_to :school

  has_many :sections, -> { order(sn: :asc, name: :asc) }, dependent: :destroy, inverse_of: :page
  has_many :widgets, -> { order(sn: :asc) }, dependent: :destroy, inverse_of: :page

  def widgets_without_section
    widgets.where(section_id: nil)
  end
end
