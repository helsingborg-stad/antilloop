# frozen_string_literal: true

FactoryBot.define do
  factory :section do
    name { 'MyString' }
    link { false }
    page factory: :page
  end
end
