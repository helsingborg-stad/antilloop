# frozen_string_literal: true

class SchoolIntegrationSync < ApplicationRecord
  belongs_to :school_integration

  enum :status, { failure: 0, success: 1 }

  scope :joins_assoc_data, lambda { |assoc_data_scope, from, to|
    return if assoc_data_scope.blank?

    from = (from.presence || Time.zone.now.utc.beginning_of_day.iso8601)
    to = (to.presence || Time.zone.now.utc.end_of_day.iso8601)

    joins(%(
        LEFT JOIN school_integration_syncs assoc_data ON
          assoc_data.reported_at = school_integration_syncs.reported_at AND
            assoc_data.id != school_integration_syncs.id AND
              assoc_data.status = 1 AND
                #{ActiveRecord::Base.sanitize_sql(['assoc_data.school_integration_id IN (?)', assoc_data_scope])} AND
                  #{ActiveRecord::Base.sanitize_sql(['assoc_data.reported_at >= ?', from])} AND
                    #{ActiveRecord::Base.sanitize_sql(['assoc_data.reported_at <= ?', to])}
      ).squish)
      .select('school_integration_syncs.*', 'JSON_AGG(assoc_data) AS assoc_data')
      .group('school_integration_syncs.id')
  }
  scope :by_reported_at_from, lambda { |from|
                                where('school_integration_syncs.reported_at >= ?', from) if from.present?
                              }
  scope :by_reported_at_to, lambda { |to|
                              where('school_integration_syncs.reported_at <= ?', to) if to.present?
                            }
  scope :by_reported_at, lambda { |from, to|
                           by_reported_at_from(from).by_reported_at_to(to)
                         }
  scope :order_by_reported_at_asc, -> { order(reported_at: :asc) }
  scope :order_by_reported_at_desc, -> { order(reported_at: :desc) }
end
