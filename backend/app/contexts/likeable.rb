# frozen_string_literal: true

module Likeable
  module_function

  def add_like!(likeable)
    likeable.likes_count += 1
    likeable.save!
  end
end
