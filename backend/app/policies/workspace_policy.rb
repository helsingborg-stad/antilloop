# frozen_string_literal: true

class WorkspacePolicy < ApplicationPolicy
  def show_school?
    school_user?
  end

  def update_school?
    school_user?
  end

  def list_sensors?
    school_user?
  end

  def list_integrations?
    school_user?
  end

  def create_school_integration?
    school_user?
  end

  def update_school_integration?
    school_user?
  end

  def delete_school_integration?
    school_user?
  end

  private

  def school_user?
    school.users.include?(user)
  end

  def school
    record
  end
end
