# frozen_string_literal: true

FactoryBot.define do
  factory :page do
    name { 'MyString' }
    home_page { false }
    school factory: :school
  end
end
