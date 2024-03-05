# frozen_string_literal: true

module Widgets
  module_function

  def get_widget(id) = Widget.find(id)

  def list_data(widget, params = {})
    from = params[:from].presence || Time.zone.now.utc.beginning_of_day.iso8601
    to = params[:to].presence || Time.zone.now.utc.end_of_day.iso8601
    assoc_data_scope = widget.data_source.school&.school_integrations&.pluck(:id)

    widget
      .data_source
      .data
      .joins_assoc_data(assoc_data_scope, from, to)
      .by_reported_at(from, to)
      .order_by_reported_at_asc
  end

  def latest_data(widget)
    widget.data_source_with_current_and_latest_data.latest_data
  end

  def latest_present_data(widget)
    return latest_data(widget) if widget.data_source.is_a?(Sensor)
    return latest_data(widget) if widget.data_source.key != 'food_waste_helsingborg'

    widget.data_source_with_current_and_latest_present_data.latest_present_data
  end

  def current_data(widget)
    widget.data_source_with_current_and_latest_data.current_data
  end

  def get_widget_data(widget, data_id)
    widget.data_source.data.find(data_id)
  end
end
