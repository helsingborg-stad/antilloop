# frozen_string_literal: true

FactoryBot.define do
  factory :school_integration do
    status { 1 }
    settings { { 'MyString' => 'MyString' } }
    integration factory: :integration
    school factory: :school
  end
end
