# frozen_string_literal: true

FactoryBot.define do
  factory :school_integration_sync do
    data { { key: 'value' } }
    school_integration factory: :school_integration
    status { :success }
  end
end
