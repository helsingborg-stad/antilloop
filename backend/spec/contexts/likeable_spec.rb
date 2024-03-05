# frozen_string_literal: true

require 'rails_helper'

describe Likeable, type: :context do
  describe '.add_like!' do
    let(:likeable) { create(:school_integration_sync) }

    it 'add a like' do
      expect { described_class.add_like!(likeable) }.to change(likeable, :likes_count).by(1)
    end
  end
end
