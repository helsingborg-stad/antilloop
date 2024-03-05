# frozen_string_literal: true

FactoryBot.define do
  factory :widget do
    data_source factory: :sensor
    page factory: :page
  end
end
