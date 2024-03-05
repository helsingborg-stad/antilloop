# frozen_string_literal: true

FactoryBot.define do
  factory :school do
    name { Faker::University.name }
    logo { nil }

    trait :with_logo do
      logo { Rack::Test::UploadedFile.new('spec/fixtures/logos/vnstraramlisaskola_fnrg.png', 'image/png') }
    end
  end
end
