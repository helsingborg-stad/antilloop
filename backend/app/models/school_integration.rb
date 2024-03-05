# frozen_string_literal: true

class SchoolIntegration < ApplicationRecord
  belongs_to :integration
  belongs_to :school

  has_many :syncs, class_name: 'SchoolIntegrationSync', dependent: :destroy
  has_many :data,
           -> { success },
           class_name: 'SchoolIntegrationSync',
           dependent: :destroy,
           inverse_of: :school_integration
  has_many :widgets, as: :data_source, dependent: :nullify

  has_one :latest_data, -> { success.order_by_reported_at_desc },
          class_name: 'SchoolIntegrationSync',
          inverse_of: :school_integration,
          primary_key: :latest_data_id,
          foreign_key: :id,
          dependent: :destroy
  has_one :latest_present_data, -> { success.order_by_reported_at_desc },
          class_name: 'SchoolIntegrationSync',
          inverse_of: :school_integration,
          primary_key: :latest_present_data_id,
          foreign_key: :id,
          dependent: :destroy
  has_one :current_data, lambda {
                           success
                             .by_reported_at(
                               Time.zone.now.utc.beginning_of_day.iso8601,
                               Time.zone.now.utc.end_of_day.iso8601
                             )
                             .order_by_reported_at_desc
                         },
          class_name: 'SchoolIntegrationSync',
          inverse_of: :school_integration,
          primary_key: :current_data_id,
          foreign_key: :id,
          dependent: :destroy

  encrypts :settings

  enum :status, { inactive: 0, active: 1 }

  scope :active, -> { where(status: :active) }
  scope :food_waste_helsingborg, -> { joins(:integration).where(integrations: { key: 'food_waste_helsingborg' }) }
  scope :oresundskraft, -> { joins(:integration).where(integrations: { key: 'oresundskraft' }) }
  scope :school_food_menu, -> { joins(:integration).where(integrations: { key: 'school_food_menu' }) }
  scope :luma_energy, -> { joins(:integration).where(integrations: { key: 'luma_energy' }) }
  scope :with_latest_data, lambda {
    select(%(
      school_integrations.*,
      (
        SELECT id as latest_data_id
        FROM school_integration_syncs
        WHERE school_integration_id = school_integrations.id AND status = 1
        ORDER BY reported_at desc
        LIMIT 1
      )
    ))
  }
  scope :with_latest_present_data, lambda {
    select(%(
      school_integrations.*,
      (
        SELECT id as latest_present_data_id
        FROM (
          SELECT school_integration_syncs.*,
                 JSON_AGG(d.v::text) AS dv
          FROM school_integration_syncs,
               jsonb_each(school_integration_syncs.data) AS d(k,v)
          WHERE school_integration_id = school_integrations.id AND status = 1
          GROUP BY school_integration_syncs.id
          ORDER BY reported_at desc
        ) sis
        WHERE NOT sis.dv::jsonb ?| array['""', 'null']
        ORDER BY reported_at desc
        LIMIT 1
      )
    ))
  }
  scope :with_current_data, lambda {
    select(%(
      school_integrations.*,
      (
        SELECT id as current_data_id
        FROM school_integration_syncs
        WHERE school_integration_id = school_integrations.id AND
          reported_at >= '#{Time.zone.now.utc.beginning_of_day.iso8601}' AND
            reported_at <= '#{Time.zone.now.utc.end_of_day.iso8601}' AND
              status = 1
        ORDER BY reported_at desc
        LIMIT 1
      )
    ))
  }

  delegate :key, :url, to: :integration
end
