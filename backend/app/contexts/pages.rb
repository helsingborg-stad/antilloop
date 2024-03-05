# frozen_string_literal: true

module Pages
  module_function

  def get_page(id)
    Page.find(id)
  end

  def find_or_create_page(params)
    Page.find_or_create_by(params)
  end

  def create_page(school, params = {})
    school.pages.create(params)
  end

  def update_page(page, params = {})
    page.update(params)
  end

  def delete_page(page)
    page.destroy
  end

  def list_pages(school)
    school.pages.order(created_at: :desc)
  end

  def get_section(page, id)
    page.sections.find(id)
  end

  def find_or_create_section(params)
    Section.find_or_create_by(params)
  end

  def add_section(page, params = {})
    page.sections.create(params)
  end

  def delete_section(section)
    section.destroy
  end

  def list_sections(page)
    page.sections
  end

  def find_or_create_widget(params)
    Widget.find_or_create_by(params)
  end

  def add_widget(page, params = {})
    page.widgets.create(params)
  end

  def delete_widget(widget)
    widget.destroy
  end

  def list_page_widgets(page)
    page.widgets
  end

  def list_section_widgets(section)
    section.widgets
  end
end
