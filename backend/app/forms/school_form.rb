# frozen_string_literal: true

class SchoolForm < Reform::Form
  property :name
  property :logo, virtual: true
  property :main_color

  validates :name, presence: true
  validates :main_color, presence: true
end
