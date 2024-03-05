# frozen_string_literal: true

FactoryBot.define do
  factory :sensor do
    name { Faker::FunnyName.name }
    device { Faker::Device.model_name }
    location { Faker::Address.full_address }
    status { 1 }
    battery_level { '255' }
    external_id { Faker::Number.number(digits: 10) }
    school factory: :school
  end
end
