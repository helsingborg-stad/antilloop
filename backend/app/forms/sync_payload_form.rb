# frozen_string_literal: true

require 'disposable/twin/property/hash'

class SyncPayloadForm < Reform::Form
  include Disposable::Twin::Property::Hash

  property :iotnode, field: :hash, populator: :iotnode!, virtual: true do
    property :_id
    property :contextMap

    validates :_id, presence: true
    validates :contextMap, presence: true
  end

  validates :iotnode, presence: true

  def iotnode!(options)
    options[:fragment].compact_blank!
  end
end
