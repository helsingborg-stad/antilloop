# frozen_string_literal: true

class SensorSync < ApplicationRecord
  belongs_to :sensor

  scope :joins_assoc_data, ->(_assoc_data_scope, _from, _to) { self }
  scope :by_reported_at_from, lambda { |from|
                                where('sensor_syncs.reported_at >= ?', from) if from.present?
                              }
  scope :by_reported_at_to, lambda { |to|
                              where('sensor_syncs.reported_at <= ?', to) if to.present?
                            }
  scope :by_reported_at, lambda { |from, to|
                           by_reported_at_from(from).by_reported_at_to(to)
                         }
  scope :order_by_reported_at_asc, -> { order(reported_at: :asc) }
  scope :order_by_reported_at_desc, -> { order(reported_at: :desc) }
end
