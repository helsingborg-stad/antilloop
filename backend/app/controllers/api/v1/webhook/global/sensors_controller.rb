# frozen_string_literal: true

module Api
  module V1
    module Webhook
      module Global
        class SensorsController < WebhookController
          skip_before_action :authorize_request
          before_action :authorize_global_sensor_request

          def create
            Sensors.global_sensor_sync(current_context, payload) do |response|
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
end
