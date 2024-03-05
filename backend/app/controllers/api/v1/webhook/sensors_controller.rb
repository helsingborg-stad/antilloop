# frozen_string_literal: true

module Api
  module V1
    module Webhook
      class SensorsController < WebhookController
        def create
          Sensors.sync(current_school, payload) do |response|
            response.success do
              render(json: {}, status: :ok)
            end

            response.failure do
              handle_unprocessable_entity(response)
            end
          end
        end

        private

        def payload
          params.require(:payload).permit!
        end
      end
    end
  end
end
