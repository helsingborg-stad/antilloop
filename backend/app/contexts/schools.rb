# frozen_string_literal: true

module Schools
  module_function

  def get_school(id) = School.find(id)

  def create_school(params)
    School.create(params)
  end

  def update_school(school, params)
    service = UpdateSchool.call(school, params)

    yield(service) if block_given?

    service
  end

  def delete_school(school)
    school.destroy
  end

  def attach_logo(school, logo)
    school.logo.attach(logo)
  end

  def detach_logo(school)
    school.logo.purge
  end

  def list_schools
    School.all.order(Arel.sql('LOWER(name) collate "sv_SE" ASC')).with_attached_logo
  end
end
