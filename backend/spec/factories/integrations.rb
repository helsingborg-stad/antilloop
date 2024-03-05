# frozen_string_literal: true

FactoryBot.define do
  factory :integration do
    name { Faker::FunnyName.name }
    key { name.parameterize.underscore }
    settings { { 'MyString' => 'MyString' } }
    url { Faker::Internet.url }
  end
end
