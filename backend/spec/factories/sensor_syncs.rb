# frozen_string_literal: true

FactoryBot.define do
  factory :sensor_sync do
    data { { key: 'value' } }
    sensor factory: :sensor
  end
end
