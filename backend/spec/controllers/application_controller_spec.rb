# frozen_string_literal: true

require 'rails_helper'

describe ApplicationController do
  describe 'handle ActiveRecord::RecordNotFound' do
    controller do
      def index
        raise ActiveRecord::RecordNotFound
      end
    end

    it 'handles ActiveRecord::RecordNotFound' do
      get :index

      expect(response.parsed_body).to eq({ 'message' => 'Not found' })
    end
  end

  describe 'handle JWT::VerificationError' do
    controller do
      def index
        raise JWT::VerificationError
      end
    end

    it 'handles JWT::VerificationError' do
      get :index

      expect(response.parsed_body).to eq({ 'message' => 'Unauthorized' })
    end
  end

  describe 'handle JWT::DecodeError' do
    controller do
      def index
        raise JWT::DecodeError
      end
    end

    it 'handles JWT::DecodeError' do
      get :index

      expect(response.parsed_body).to eq({ 'message' => 'Unauthorized' })
    end
  end

  describe 'handle RequestUnauthorizedError' do
    controller do
      def index
        raise ApplicationController::RequestUnauthorizedError
      end
    end

    it 'handles RequestUnauthorizedError' do
      get :index

      expect(response.parsed_body).to eq({ 'message' => 'Unauthorized' })
    end
  end

  describe 'handle Pundit::NotAuthorizedError' do
    controller do
      def index
        raise Pundit::NotAuthorizedError
      end
    end

    it 'handles Pundit::NotAuthorizedError' do
      get :index

      expect(response.parsed_body).to eq({ 'message' => 'Forbidden' })
    end
  end

  describe 'handle I18n::InvalidLocale' do
    controller do
      def index
        raise I18n::InvalidLocale, 'Invalid locale'
      end
    end

    it 'handles I18n::InvalidLocale' do
      get :index

      expect(response.parsed_body).to eq({ 'message' => 'Invalid locale' })
    end
  end
end
