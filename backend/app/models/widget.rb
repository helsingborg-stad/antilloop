# frozen_string_literal: true

class Widget < ApplicationRecord
  belongs_to :data_source, polymorphic: true
  belongs_to :data_source_with_current_and_latest_data,
             -> { with_current_data.with_latest_data },
             foreign_key: :data_source_id,
             foreign_type: :data_source_type,
             polymorphic: true
  belongs_to :data_source_with_current_and_latest_present_data,
             -> { with_current_data.with_latest_present_data },
             foreign_key: :data_source_id,
             foreign_type: :data_source_type,
             polymorphic: true
  belongs_to :page
  belongs_to :section, optional: true

  has_one :school, through: :page

  scope :active, lambda {
                   joins(%(
                      LEFT JOIN sensors ON
                      sensors.id = widgets.data_source_id AND
                      widgets.data_source_type = 'Sensor'
                   ).squish)
                     .joins(%(
                      LEFT JOIN school_integrations ON
                      school_integrations.id = widgets.data_source_id AND
                      widgets.data_source_type = 'SchoolIntegration'
                    ).squish)
                     .where('sensors.status = 1 OR school_integrations.status = 1')
                 }

  delegate :active?, to: :data_source

  def data_source_url
    data_source_type == 'SchoolIntegration' ? data_source.url : nil
  end
end
