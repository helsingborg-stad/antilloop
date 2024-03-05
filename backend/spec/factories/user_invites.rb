# frozen_string_literal: true

FactoryBot.define do
  factory :user_invite do
    email { Faker::Internet.email }
    school factory: :school
  end
end
