# frozen_string_literal: true

require 'rails_helper'

describe Workspace, type: :context do
  let(:school) { create(:school) }

  describe '.auto_config_school_home_page_sensor_widget' do
    before do
      create(:page, school:, home_page: true)
    end

    context 'when yosensi_agri_box' do
      let(:sensor) { create(:sensor, device: 'yosensi_agri_box') }

      it 'creates a section' do
        described_class.auto_config_school_home_page_sensor_widget(school, sensor)

        expect(school.home_page.sections.find_by(theme: 'plant_care', sn: 1).present?).to be(true)
      end

      it 'creates a widget' do
        section = create(:section, page: school.home_page,
                                   name: 'Plant care',
                                   theme: 'plant_care',
                                   sn: 1)

        described_class.auto_config_school_home_page_sensor_widget(school, sensor)

        widget = section.widgets.first

        expect(widget.data_source).to eq(sensor)
        expect(widget.data_source_key).to eq('yosensi_agri_box')
        expect(widget.sn).to eq(0)

        # add one more sensor to test sn
        described_class.auto_config_school_home_page_sensor_widget(school, create(:sensor, device: 'yosensi_agri_box'))

        expect(section.widgets.second.sn).to eq(1)
      end

      it "doesn't create a widget" do
        section = create(:section, page: school.home_page,
                                   name: 'Plant care',
                                   theme: 'plant_care',
                                   sn: 1)

        create(:widget, page: school.home_page, section:, data_source: sensor,
                        data_source_key: 'yosensi_agri_box')

        expect do
          described_class.auto_config_school_home_page_sensor_widget(school, sensor)
        end.not_to(change(Widget, :count))
      end

      it 'deletes a widget' do
        section = create(:section, page: school.home_page,
                                   name: 'Plant care',
                                   theme: 'plant_care',
                                   sn: 1)

        create(:widget, page: school.home_page, section:, data_source: sensor,
                        data_source_key: 'yosensi_agri_box')

        another_school = create(:school)

        described_class.auto_config_school_home_page_sensor_widget(another_school, sensor)

        expect(school.widgets.count).to eq(0)
      end

      it 'deletes sections w/o widgets' do
        section_1 = create(:section, page: school.home_page,
                                     name: 'Plant care',
                                     theme: 'plant_care',
                                     sn: 1)
        section_2 = create(:section, page: school.home_page)
        section_3 = create(:section)

        create(:widget, page: school.home_page, section: section_1, data_source: sensor,
                        data_source_key: 'yosensi_agri_box')
        create(:widget, page: school.home_page, section: section_2,
                        data_source: create(:sensor, device: 'yosensi_agri_box'), data_source_key: 'yosensi_agri_box')
        create(:widget, page: section_3.page, section: section_3,
                        data_source: create(:sensor, device: 'yosensi_agri_box'), data_source_key: 'yosensi_agri_box')

        another_school = create(:school)

        described_class.auto_config_school_home_page_sensor_widget(another_school, sensor)

        expect(Section.find_by(id: section_1.id)).to be_nil
        expect(Section.find_by(id: section_2.id)).not_to be_nil
        expect(Section.find_by(id: section_3.id)).not_to be_nil
      end
    end

    context 'when decentlab_dl_pm' do
      let(:sensor) { create(:sensor, device: 'decentlab_dl_pm') }

      it 'creates a section' do
        described_class.auto_config_school_home_page_sensor_widget(school, sensor)

        expect(school.home_page.sections.find_by(theme: 'environmental_monitor', sn: 2).present?).to be(true)
      end

      it 'creates a widget' do
        section = create(:section, page: school.home_page,
                                   name: 'Environmental monitor',
                                   theme: 'environmental_monitor',
                                   sn: 2)

        described_class.auto_config_school_home_page_sensor_widget(school, sensor)

        widget_1 = section.widgets.first
        widget_2 = section.widgets.second
        widget_3 = section.widgets.third

        expect(widget_1.data_source).to eq(sensor)
        expect(widget_1.data_source_key).to eq('decentlab_dl_pm/air_temperature')
        expect(widget_1.sn).to eq(0)

        expect(widget_2.data_source).to eq(sensor)
        expect(widget_2.data_source_key).to eq('decentlab_dl_pm/pm2_5_mass_concentration')
        expect(widget_2.sn).to eq(1)

        expect(widget_3.data_source).to eq(sensor)
        expect(widget_3.data_source_key).to eq('decentlab_dl_pm/pm10_0_mass_concentration')
        expect(widget_3.sn).to eq(2)

        # add one more sensor to test sn
        described_class.auto_config_school_home_page_sensor_widget(school, create(:sensor, device: 'decentlab_dl_pm'))

        expect(section.widgets.second.sn).to eq(1)
      end

      it "doesn't create a widget" do
        section = create(:section, page: school.home_page,
                                   name: 'Environmental monitor',
                                   theme: 'environmental_monitor',
                                   sn: 2)

        create(:widget, page: school.home_page, section:, data_source: sensor,
                        data_source_key: 'decentlab_dl_pm/air_temperature')

        expect do
          described_class.auto_config_school_home_page_sensor_widget(school, sensor)
        end.not_to(change(Widget, :count))
      end

      it 'deletes a widget' do
        section = create(:section, page: school.home_page,
                                   name: 'Environmental monitor',
                                   theme: 'environmental_monitor',
                                   sn: 2)

        create(:widget, page: school.home_page, section:, data_source: sensor,
                        data_source_key: 'decentlab_dl_pm/air_temperature')

        another_school = create(:school)

        described_class.auto_config_school_home_page_sensor_widget(another_school, sensor)

        expect(school.widgets.count).to eq(0)
      end

      it 'deletes sections w/o widgets' do
        section_1 = create(:section, page: school.home_page,
                                     name: 'Environmental monitor',
                                     theme: 'environmental_monitor',
                                     sn: 2)
        section_2 = create(:section, page: school.home_page)
        section_3 = create(:section)

        create(:widget, page: school.home_page, section: section_1, data_source: sensor,
                        data_source_key: 'decentlab_dl_pm/air_temperature')
        create(:widget, page: school.home_page, section: section_2,
                        data_source: create(:sensor, device: 'decentlab_dl_pm'),
                        data_source_key: 'decentlab_dl_pm/air_temperature')
        create(:widget, page: section_3.page, section: section_3,
                        data_source: create(:sensor, device: 'decentlab_dl_pm'),
                        data_source_key: 'decentlab_dl_pm/air_temperature')

        another_school = create(:school)

        described_class.auto_config_school_home_page_sensor_widget(another_school, sensor)

        expect(Section.find_by(id: section_1.id)).to be_nil
        expect(Section.find_by(id: section_2.id)).not_to be_nil
        expect(Section.find_by(id: section_3.id)).not_to be_nil
      end
    end

    context 'when synetica_enlink' do
      let(:sensor) { create(:sensor, device: 'synetica_enlink') }

      it 'creates a section' do
        described_class.auto_config_school_home_page_sensor_widget(school, sensor)

        expect(school.home_page.sections.find_by(theme: 'environmental_monitor', sn: 2).present?).to be(true)
      end

      it 'creates a widget' do
        section = create(:section, page: school.home_page,
                                   name: 'Environmental monitor',
                                   theme: 'environmental_monitor',
                                   sn: 2)

        described_class.auto_config_school_home_page_sensor_widget(school, sensor)

        widget_1 = section.widgets.first
        widget_2 = section.widgets.second
        widget_3 = section.widgets.third

        expect(widget_1.data_source).to eq(sensor)
        expect(widget_1.data_source_key).to eq('synetica_enlink/air_temperature')
        expect(widget_1.sn).to eq(0)

        expect(widget_2.data_source).to eq(sensor)
        expect(widget_2.data_source_key).to eq('synetica_enlink/pm2_5_mass_concentration')
        expect(widget_2.sn).to eq(1)

        expect(widget_3.data_source).to eq(sensor)
        expect(widget_3.data_source_key).to eq('synetica_enlink/pm10_0_mass_concentration')
        expect(widget_3.sn).to eq(2)

        # add one more sensor to test sn
        described_class.auto_config_school_home_page_sensor_widget(school, create(:sensor, device: 'synetica_enlink'))

        expect(section.widgets.second.sn).to eq(1)
      end

      it "doesn't create a widget" do
        section = create(:section, page: school.home_page,
                                   name: 'Environmental monitor',
                                   theme: 'environmental_monitor',
                                   sn: 2)

        create(:widget, page: school.home_page, section:, data_source: sensor,
                        data_source_key: 'synetica_enlink/air_temperature')

        expect do
          described_class.auto_config_school_home_page_sensor_widget(school, sensor)
        end.not_to(change(Widget, :count))
      end

      it 'deletes a widget' do
        section = create(:section, page: school.home_page,
                                   name: 'Environmental monitor',
                                   theme: 'environmental_monitor',
                                   sn: 2)

        create(:widget, page: school.home_page, section:, data_source: sensor,
                        data_source_key: 'synetica_enlink/air_temperature')

        another_school = create(:school)

        described_class.auto_config_school_home_page_sensor_widget(another_school, sensor)

        expect(school.widgets.count).to eq(0)
      end

      it 'deletes sections w/o widgets' do
        section_1 = create(:section, page: school.home_page,
                                     name: 'Environmental monitor',
                                     theme: 'environmental_monitor',
                                     sn: 2)
        section_2 = create(:section, page: school.home_page)
        section_3 = create(:section)

        create(:widget, page: school.home_page, section: section_1, data_source: sensor,
                        data_source_key: 'synetica_enlink/air_temperature')
        create(:widget, page: school.home_page, section: section_2,
                        data_source: create(:sensor, device: 'synetica_enlink'),
                        data_source_key: 'synetica_enlink/air_temperature')
        create(:widget, page: section_3.page, section: section_3,
                        data_source: create(:sensor, device: 'synetica_enlink'),
                        data_source_key: 'synetica_enlink/air_temperature')

        another_school = create(:school)

        described_class.auto_config_school_home_page_sensor_widget(another_school, sensor)

        expect(Section.find_by(id: section_1.id)).to be_nil
        expect(Section.find_by(id: section_2.id)).not_to be_nil
        expect(Section.find_by(id: section_3.id)).not_to be_nil
      end
    end

    context 'when elsys_ers_sound' do
      let(:sensor) { create(:sensor, device: 'elsys_ers_sound', location: 'Location 1') }

      it 'creates a section' do
        described_class.auto_config_school_home_page_sensor_widget(school, sensor)

        expect(school.home_page.sections.find_by(name: 'Location 1', link: true, sn: 0).present?).to be(true)

        # add one more sensor to test sn

        sensor = create(:sensor, device: 'elsys_ers_sound', location: 'Location 2')

        described_class.auto_config_school_home_page_sensor_widget(school, sensor)

        expect(school.home_page.sections.find_by(name: 'Location 2', link: true, sn: 1).present?).to be(true)
      end

      it 'creates a widget' do
        section = create(:section, page: school.home_page,
                                   name: 'Location 1',
                                   link: true)

        described_class.auto_config_school_home_page_sensor_widget(school, sensor)

        widget = section.widgets.first

        expect(widget.data_source).to eq(sensor)
        expect(widget.data_source_key).to eq('elsys_ers_sound/noise_level_average')
        expect(widget.sn).to eq(0)
      end

      it "doesn't create a widget" do
        section = create(:section, page: school.home_page,
                                   name: 'Location 1',
                                   link: true)

        create(:widget, page: school.home_page, section:, data_source: sensor,
                        data_source_key: 'elsys_ers_sound/noise_level_average')

        expect do
          described_class.auto_config_school_home_page_sensor_widget(school, sensor)
        end.not_to(change(Widget, :count))
      end

      it 'updates a widget section' do
        section = create(:section, page: school.home_page,
                                   name: 'Location 1',
                                   link: true)

        widget = create(:widget, page: school.home_page, section:, data_source: sensor,
                                 data_source_key: 'elsys_ers_sound/noise_level_average', sn: 0)

        sensor.update(location: 'Location 2')

        described_class.auto_config_school_home_page_sensor_widget(school, sensor)

        expect(widget.reload.section.name).to eq('Location 2')
        expect(Section.find_by(name: 'Location 1').present?).to be(false)
      end

      it 'deletes a widget' do
        section = create(:section, page: school.home_page,
                                   name: 'Location 1',
                                   link: true)

        create(:widget, page: school.home_page, section:, data_source: sensor,
                        data_source_key: 'elsys_ers_sound/noise_level_average', sn: 0)

        another_school = create(:school)

        described_class.auto_config_school_home_page_sensor_widget(another_school, sensor)

        expect(school.widgets.count).to eq(0)
      end

      it 'deletes sections w/o widgets' do
        section_1 = create(:section, page: school.home_page,
                                     name: 'Location 1',
                                     link: true)
        section_2 = create(:section, page: school.home_page)
        section_3 = create(:section)

        create(:widget, page: school.home_page, section: section_1, data_source: sensor,
                        data_source_key: 'elsys_ers_sound/noise_level_average')
        create(:widget, page: school.home_page, section: section_2,
                        data_source: create(:sensor, device: 'elsys_ers_sound'),
                        data_source_key: 'elsys_ers_sound/noise_level_average')
        create(:widget, page: section_3.page, section: section_3,
                        data_source: create(:sensor, device: 'elsys_ers_sound'),
                        data_source_key: 'elsys_ers_sound/noise_level_average')

        another_school = create(:school)

        described_class.auto_config_school_home_page_sensor_widget(another_school, sensor)

        expect(Section.find_by(id: section_1.id)).to be_nil
        expect(Section.find_by(id: section_2.id)).not_to be_nil
        expect(Section.find_by(id: section_3.id)).not_to be_nil
      end
    end

    context 'when elsys_ers_co2' do
      let(:sensor) { create(:sensor, device: 'elsys_ers_co2', location: 'Location 1') }

      it 'creates a section' do
        described_class.auto_config_school_home_page_sensor_widget(school, sensor)

        expect(school.home_page.sections.find_by(name: 'Location 1', link: true, sn: 0).present?).to be(true)

        # add one more sensor to test sn

        sensor = create(:sensor, device: 'elsys_ers_co2', location: 'Location 2')

        described_class.auto_config_school_home_page_sensor_widget(school, sensor)

        expect(school.home_page.sections.find_by(name: 'Location 2', link: true, sn: 1).present?).to be(true)
      end

      it 'creates a widget' do
        section = create(:section, page: school.home_page,
                                   name: 'Location 1',
                                   link: true)

        described_class.auto_config_school_home_page_sensor_widget(school, sensor)

        widget_1 = section.widgets.first
        widget_2 = section.widgets.second

        expect(widget_1.data_source).to eq(sensor)
        expect(widget_1.data_source_key).to eq('elsys_ers_co2/temperature')
        expect(widget_1.sn).to eq(1)

        expect(widget_2.data_source).to eq(sensor)
        expect(widget_2.data_source_key).to eq('elsys_ers_co2/co2')
        expect(widget_2.sn).to eq(2)
      end

      it "doesn't create a widget" do
        section = create(:section, page: school.home_page,
                                   name: 'Location 1',
                                   link: true)

        create(:widget, page: school.home_page, section:, data_source: sensor,
                        data_source_key: 'elsys_ers_sound/co2')
        create(:widget, page: school.home_page, section:, data_source: sensor,
                        data_source_key: 'elsys_ers_sound/temperature')

        expect do
          described_class.auto_config_school_home_page_sensor_widget(school, sensor)
        end.not_to(change(Widget, :count))
      end

      it 'updates a widget section' do
        section = create(:section, page: school.home_page,
                                   name: 'Location 1',
                                   link: true)

        widget_1 = create(:widget, page: school.home_page, section:, data_source: sensor,
                                   data_source_key: 'elsys_ers_co2/temperature', sn: 1)
        widget_2 = create(:widget, page: school.home_page, section:, data_source: sensor,
                                   data_source_key: 'elsys_ers_co2/co2', sn: 2)

        sensor.update(location: 'Location 2')

        described_class.auto_config_school_home_page_sensor_widget(school, sensor)

        expect(widget_1.reload.section.name).to eq('Location 2')
        expect(widget_2.reload.section.name).to eq('Location 2')
        expect(Section.find_by(name: 'Location 1').present?).to be(false)
      end

      it 'deletes a widget' do
        section = create(:section, page: school.home_page,
                                   name: 'Location 1',
                                   link: true)

        create(:widget, page: school.home_page, section:, data_source: sensor,
                        data_source_key: 'elsys_ers_co2/temperature', sn: 1)
        create(:widget, page: school.home_page, section:, data_source: sensor,
                        data_source_key: 'elsys_ers_co2/co2', sn: 2)

        another_school = create(:school)

        described_class.auto_config_school_home_page_sensor_widget(another_school, sensor)

        expect(school.widgets.count).to eq(0)
      end

      it 'deletes sections w/o widgets' do
        section_1 = create(:section, page: school.home_page,
                                     name: 'Location 1',
                                     link: true)
        section_2 = create(:section, page: school.home_page)
        section_3 = create(:section)

        create(:widget, page: school.home_page, section: section_1, data_source: sensor,
                        data_source_key: 'elsys_ers_co2/temperature', sn: 1)
        create(:widget, page: school.home_page, section: section_1, data_source: sensor,
                        data_source_key: 'elsys_ers_co2/co2', sn: 2)
        create(:widget, page: school.home_page, section: section_2,
                        data_source: create(:sensor, device: 'elsys_ers_co2'),
                        data_source_key: 'elsys_ers_co2/temperature', sn: 1)
        create(:widget, page: school.home_page, section: section_2,
                        data_source: create(:sensor, device: 'elsys_ers_co2'),
                        data_source_key: 'elsys_ers_co2/temperature', sn: 2)
        create(:widget, page: section_3.page, section: section_3,
                        data_source: create(:sensor, device: 'elsys_ers_co2'),
                        data_source_key: 'elsys_ers_co2/temperature', sn: 1)
        create(:widget, page: section_3.page, section: section_3,
                        data_source: create(:sensor, device: 'elsys_ers_co2'),
                        data_source_key: 'elsys_ers_co2/temperature', sn: 2)

        another_school = create(:school)

        described_class.auto_config_school_home_page_sensor_widget(another_school, sensor)

        expect(Section.find_by(id: section_1.id)).to be_nil
        expect(Section.find_by(id: section_2.id)).not_to be_nil
        expect(Section.find_by(id: section_3.id)).not_to be_nil
      end
    end
  end

  describe '.auto_config_school_home_page_school_integration_widget' do
    context 'when food_waste_helsingborg' do
      let(:integration) { create(:integration, key: 'food_waste_helsingborg') }
      let(:school_integration) { create(:school_integration, school:, integration:) }

      before do
        create(:page, school:, home_page: true)
      end

      it 'creates a section' do
        described_class.auto_config_school_home_page_school_integration_widget(school, school_integration)

        expect(school.home_page.sections.find_by(theme: 'food_tracker', sn: 0).present?).to be(true)
      end

      it 'creates a widget' do
        section = create(:section, page: school.home_page,
                                   name: 'Food tracker',
                                   theme: 'food_tracker',
                                   sn: 0)

        described_class.auto_config_school_home_page_school_integration_widget(school, school_integration)

        widget = section.widgets.first

        expect(widget.data_source).to eq(school_integration)
        expect(widget.data_source_key).to eq('food_waste_helsingborg')
        expect(widget.sn).to eq(0)
      end
    end

    context 'when school_food_menu' do
      let(:integration) { create(:integration, key: 'school_food_menu') }
      let(:school_integration) { create(:school_integration, school:, integration:) }

      before do
        create(:page, school:, home_page: true)
      end

      it 'creates a section' do
        described_class.auto_config_school_home_page_school_integration_widget(school, school_integration)

        expect(school.home_page.sections.find_by(theme: 'food_tracker', sn: 0).present?).to be(true)
      end

      it 'creates a widget' do
        section = create(:section, page: school.home_page,
                                   name: 'Food tracker',
                                   theme: 'food_tracker',
                                   sn: 0)

        described_class.auto_config_school_home_page_school_integration_widget(school, school_integration)

        widget = section.widgets.first

        expect(widget.data_source).to eq(school_integration)
        expect(widget.data_source_key).to eq('school_food_menu')
        expect(widget.sn).to eq(1)
      end
    end

    context 'when oresundskraft' do
      let(:integration) { create(:integration, key: 'oresundskraft') }
      let(:school_integration) { create(:school_integration, school:, integration:) }

      before do
        create(:page, school:, home_page: true)
      end

      it 'creates a section' do
        described_class.auto_config_school_home_page_school_integration_widget(school, school_integration)

        expect(school.home_page.sections.find_by(theme: 'electricity_meter', sn: 3).present?).to be(true)
      end

      it 'creates a widget' do
        section = create(:section, page: school.home_page,
                                   name: 'Electricity meter',
                                   theme: 'electricity_meter',
                                   sn: 3)

        described_class.auto_config_school_home_page_school_integration_widget(school, school_integration)

        widget = section.widgets.first

        expect(widget.data_source).to eq(school_integration)
        expect(widget.data_source_key).to eq('oresundskraft')
        expect(widget.sn).to eq(0)
      end
    end

    context 'when luma_energy' do
      let(:integration) { create(:integration, key: 'luma_energy') }
      let(:school_integration) { create(:school_integration, school:, integration:) }

      before do
        create(:page, school:, home_page: true)
      end

      it 'creates a section' do
        described_class.auto_config_school_home_page_school_integration_widget(school, school_integration)

        expect(school.home_page.sections.find_by(theme: 'electricity_meter', sn: 3).present?).to be(true)
      end

      it 'creates a widget' do
        section = create(:section, page: school.home_page,
                                   name: 'Electricity meter',
                                   theme: 'electricity_meter',
                                   sn: 3)

        described_class.auto_config_school_home_page_school_integration_widget(school, school_integration)

        widget = section.widgets.first

        expect(widget.data_source).to eq(school_integration)
        expect(widget.data_source_key).to eq('luma_energy')
        expect(widget.sn).to eq(1)
      end
    end

    context 'when weather_helsingborg' do
      let(:integration) { create(:integration, key: 'weather_helsingborg') }
      let(:school_integration) { create(:school_integration, school:, integration:) }

      before do
        create(:page, school:, home_page: true)
      end

      it 'creates a section' do
        described_class.auto_config_school_home_page_school_integration_widget(school, school_integration)

        expect(school.home_page.sections.find_by(theme: 'environmental_monitor', sn: 2).present?).to be(true)
      end

      it 'creates a widget' do
        section = create(:section, page: school.home_page,
                                   name: 'Environmental monitor',
                                   theme: 'environmental_monitor',
                                   sn: 2)

        described_class.auto_config_school_home_page_school_integration_widget(school, school_integration)

        widget = section.widgets.first

        expect(widget.data_source).to eq(school_integration)
        expect(widget.data_source_key).to eq('weather_helsingborg')
        expect(widget.sn).to eq(3)
      end
    end

    context 'when footprint_calculator' do
      let(:integration) { create(:integration, key: 'footprint_calculator') }
      let(:school_integration) { create(:school_integration, school:, integration:) }

      before do
        create(:page, school:, home_page: true)
      end

      it 'creates a section' do
        described_class.auto_config_school_home_page_school_integration_widget(school, school_integration)

        expect(school.home_page.sections.find_by(theme: 'footprint_calculator', sn: 4,
                                                 school_page: false).present?).to be(true)
      end

      it 'creates a widget' do
        section = create(:section, page: school.home_page,
                                   name: 'Footprint calculator',
                                   theme: 'footprint_calculator',
                                   school_page: false,
                                   sn: 4)

        described_class.auto_config_school_home_page_school_integration_widget(school, school_integration)

        widget = section.widgets.first

        expect(widget.data_source).to eq(school_integration)
        expect(widget.data_source_key).to eq('footprint_calculator')
        expect(widget.sn).to eq(0)
      end
    end

    context 'when school_integration_key is not supported' do
      let(:integration) { create(:integration, key: 'unsupported') }
      let(:school_integration) { create(:school_integration, school:, integration:) }

      it 'does not create a home page' do
        described_class.auto_config_school_home_page_school_integration_widget(school, school_integration)

        expect(school.home_page).to be_nil
      end
    end
  end
end
