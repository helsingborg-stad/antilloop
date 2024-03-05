# frozen_string_literal: true

module Schools
  class UpdateSchool < Service
    def initialize(school, params)
      @school = school
      @params = params
    end

    def call
      return errors!(form.errors) unless form.validate(params)

      form.sync
      form.model.save!
      Schools.attach_logo(form.model, params[:logo]) if params[:logo].present?

      data!(form.model)
    end

    private

    attr_reader :school, :params

    def form
      @form ||= SchoolForm.new(school)
    end
  end
end
