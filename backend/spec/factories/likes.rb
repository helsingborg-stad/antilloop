# frozen_string_literal: true

FactoryBot.define do
  factory :like do
    likeable factory: %i[widget]
  end
end
