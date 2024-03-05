# frozen_string_literal: true

require 'active_model'

class Service
  def self.call(*args, &block)
    service = new(*args, &block)

    service.call

    block ? yield(service) : service
  end

  attr_reader :data

  def data!(data)
    @data = data
  end

  def errors
    @errors ||= ActiveModel::Errors.new(self)
  end

  def errors!(errors)
    @errors = errors
  end

  def success
    yield if block_given? && success?
  end

  def failure
    yield if block_given? && failure?
  end

  def success?
    errors.empty?
  end

  def failure?
    !success?
  end
end
