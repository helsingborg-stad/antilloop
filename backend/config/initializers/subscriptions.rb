# frozen_string_literal: true

Rails.application.reloader.to_prepare do
  Wisper.subscribe(SchoolHomePageSubscription, async: true)
end
