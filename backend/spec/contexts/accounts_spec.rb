# frozen_string_literal: true

require 'rails_helper'

describe Accounts, type: :context do
  describe '.create_user_account' do
    context 'when params are valid' do
      it 'creates a user account' do
        user_invite = create(:user_invite)
        params = {
          email: user_invite.email,
          name: Faker::Name.name
        }

        service = described_class.create_user_account(params)

        expect(service).to be_success
        expect(service.data).to be_a(User)
        expect(service.data.school).to eq(user_invite.school)
        expect(user_invite.reload).to be_accepted
        expect(user_invite.reload.accepted_at).to be_present
      end

      it 'downcases email' do
        user_invite = create(:user_invite)
        params = {
          email: user_invite.email.upcase,
          name: Faker::Name.name
        }

        service = described_class.create_user_account(params)

        expect(service).to be_success
        expect(service.data).to be_a(User)
        expect(service.data.school).to eq(user_invite.school)
        expect(user_invite.reload).to be_accepted
        expect(user_invite.reload.accepted_at).to be_present
      end
    end

    context 'when user_school_name is present' do
      it 'create a user account' do
        school = create(:school, name: 'Västra Ramlösa skola')
        params = {
          email: 'abcd1234@mail.com',
          name: "#{Faker::Name.name} #{school.name}"
        }

        service = described_class.create_user_account(params)

        expect(service).to be_success
        expect(service.data).to be_a(User)
        expect(service.data.school).to eq(school)
      end

      it 'downcases email' do
        school = create(:school, name: 'Västra Ramlösa skola')
        params = {
          email: 'ABCD1234@mail.com',
          name: "#{Faker::Name.name} #{school.name}"
        }

        service = described_class.create_user_account(params)

        expect(service).to be_success
        expect(service.data.email).to eq(params[:email].downcase)
      end
    end

    context 'when params are invalid' do
      it "doesn't create a user account" do
        service = described_class.create_user_account({})

        expect(service).not_to be_success
        expect(service.errors).to include(:email)
        expect(service.errors).to include(:name)
      end
    end

    context 'when email is already taken' do
      it "doesn't create a user account" do
        user = create(:user)

        service = described_class.create_user_account(email: user.email)

        expect(service).not_to be_success
        expect(service.errors).to include(:email)
      end
    end

    context "when user invite doesn't exist" do
      it "doesn't create a user account" do
        service = described_class.create_user_account(email: Faker::Internet.email)

        expect(service).not_to be_success
        expect(service.errors).to include(:base)
      end
    end
  end

  describe '.delete_user_account' do
    it 'deletes the user account' do
      user = create(:user)

      service = described_class.delete_user_account(user)

      expect(service).to be_success
      expect(service.data).to eq(user)
      expect { user.reload }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  describe '.get_user' do
    it 'returns the user' do
      user = create(:user)

      result = described_class.get_user(user.id)

      expect(result).to eq(user)
    end
  end

  describe '.get_user_by_email' do
    context 'when user exists' do
      it 'returns the user' do
        user = create(:user)

        result = described_class.get_user_by_email(email: user.email)

        expect(result).to eq(user)
      end
    end

    context "when user doesn't exist" do
      it 'returns nil' do
        result = described_class.get_user_by_email(email: Faker::Internet.email)

        expect(result).to be_nil
      end
    end
  end

  describe '.get_user_invite_by_email' do
    context 'when user invite exists' do
      it 'returns the user invite' do
        user_invite = create(:user_invite)

        result = described_class.get_user_invite_by_email(email: user_invite.email)

        expect(result).to eq(user_invite)
      end
    end

    context "when user invite doesn't exist" do
      it 'returns nil' do
        result = described_class.get_user_invite_by_email(email: Faker::Internet.email)

        expect(result).to be_nil
      end
    end
  end

  describe '.sign_in' do
    context 'when params are valid' do
      it 'signs in a user' do
        user = create(:user)
        params = {
          email: user.email,
          name: user.name
        }

        service = described_class.sign_in(params)

        expect(service).to be_success
        expect(service.data).to be_a(User)
        expect(service.data.access_token).to be_present
      end

      it 'downcases the email' do
        user = create(:user)
        params = {
          email: user.email.upcase,
          name: user.name
        }

        service = described_class.sign_in(params)

        expect(service).to be_success
        expect(service.data).to be_a(User)
        expect(service.data.access_token).to be_present
      end
    end

    context 'when params are invalid' do
      it "doesn't sign in a user" do
        service = described_class.sign_in({})

        expect(service).not_to be_success
        expect(service.errors).to include(:email)
      end
    end

    context "when user doesn't exist" do
      it 'creates and signs in a user' do
        user_invite = create(:user_invite)

        service = described_class.sign_in(email: user_invite.email, name: Faker::Name.name)

        expect(service).to be_success
        expect(service.data).to be_a(User)
        expect(service.data.access_token).to be_present
      end
    end

    context "when user invite doesn't exist" do
      it "doesn't sign in a user" do
        service = described_class.sign_in(email: Faker::Internet.email, name: Faker::Name.name)

        expect(service).not_to be_success
        expect(service.errors).to include(:base)
      end
    end
  end

  describe '.encode_access_token' do
    it 'encodes a user access token' do
      user = create(:user)

      result = described_class.encode_access_token(user)

      expect(result).to be_present
    end
  end

  describe '.decode_access_token' do
    it 'decodes a user access token' do
      user = create(:user)
      access_token = described_class.encode_access_token(user)

      result = described_class.decode_access_token(access_token)

      expect(result).to be_present
    end
  end

  describe '.create_user_invite' do
    context 'when params are valid' do
      it 'creates a user invite' do
        school = create(:school)
        params = {
          email: Faker::Internet.email,
          school:
        }

        service = described_class.create_user_invite(params)

        expect(service).to be_success
        expect(service.data).to be_a(UserInvite)
        expect(service.data.school).to eq(school)
      end

      it 'downcases the email' do
        school = create(:school)
        params = {
          email: Faker::Internet.email.upcase,
          school:
        }

        service = described_class.create_user_invite(params)

        expect(service).to be_success
        expect(service.data.email).to eq(params[:email].downcase)
      end
    end

    context 'when params are invalid' do
      it "doesn't create a user invite" do
        service = described_class.create_user_invite({})

        expect(service).not_to be_success
        expect(service.errors).to include(:email)
        expect(service.errors).to include(:school)
      end
    end
  end
end
