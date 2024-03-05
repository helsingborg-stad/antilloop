# frozen_string_literal: true

require 'sidekiq/web'

Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs' if Rails.env.development?
  mount Rswag::Api::Engine => '/api-docs' if Rails.env.development?
  mount Sidekiq::Web => '/sidekiq'

  get '/heartbeat', to: proc { [200, {}, ['app ok']] }

  namespace :api do
    namespace :v1, constraints: { id: /\d+/ } do
      namespace :workspace do
        resources :schools, only: %i[show update] do
          resources :sensors, only: :index
          resources :integrations, only: :index do
            resources :school_integrations, only: %i[create]
          end
        end
        resources :school_integrations, only: %i[update destroy]
      end

      namespace :webhook do
        resources :sensors, only: :create
        namespace :global do
          resources :sensors, only: :create
        end
      end

      resources :schools, only: %i[index show] do
        get '/home_page', controller: :school_home_page, action: :show
        get '/home_page/overview', controller: :school_home_page_overview, action: :show
      end
      resources :pages, only: %i[show] do
        resources :sections, only: %i[show]
      end
      resources :widgets, only: [] do
        resources :data, only: :index, controller: :widget_data
        get '/latest_data', controller: :widget_latest_data, action: :show
        get '/current_data', controller: :widget_current_data, action: :show
        post '/data/:data_id/likes', controller: :widget_data_likes, action: :create
      end

      post '/user_accounts/sign_in', controller: :user_sessions, action: :create
      get '/user_accounts/show', controller: :user_accounts, action: :show
    end
  end

  match '/api/v1/*unmatched', to: 'api#route_not_found', via: :all
end
