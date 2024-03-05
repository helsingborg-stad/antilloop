# frozen_string_literal: true

class ApplicationSerializer < Representable::Decorator
  include Representable::JSON

  defaults render_nil: true
end
