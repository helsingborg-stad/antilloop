# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

UserInvite.destroy_all
SensorSync.destroy_all
Sensor.destroy_all
SchoolIntegrationSync.destroy_all
SchoolIntegration.destroy_all
Integration.destroy_all
Widget.destroy_all
Section.destroy_all
Page.destroy_all
School.destroy_all

School.create(
  name: 'Test School',
  main_color: Random.bytes(3).unpack1('H*').prepend('#')
)

test_school = School.find_by(name: 'Test School')

UserInvite.create([
                    { email: 'user@mail.com', school: test_school }
                  ])

sensor_1 = Sensor.create(
  name: 'sensor_1',
  school: test_school,
  device: 'elsys_ers_sound',
  status: :active,
  location: 'Class 1',
  battery_level: rand(0..255)
)

start_time = 1.week.ago.beginning_of_day

while start_time < Time.zone.now.utc
  noise_level_average =
    if start_time.hour >= 0 && start_time.hour <= 7
      rand(0..15)
    elsif start_time.hour >= 8 && start_time.hour <= 12
      rand(35..60)
    elsif start_time.hour >= 13 && start_time.hour <= 17
      rand(60..100)
    else
      rand(0..35)
    end

  SensorSync.create(
    sensor: sensor_1,
    value: {},
    data: { date: start_time.iso8601, noise_level_average: },
    reported_at: start_time
  )

  start_time += 15.minutes
end

sensor_2 = Sensor.create(
  name: 'sensor_2',
  school: test_school,
  device: 'elsys_ers_co2',
  status: :active,
  location: 'Class 1',
  battery_level: rand(0..255)
)

start_time = 1.week.ago.beginning_of_day

while start_time < Time.zone.now.utc
  SensorSync.create(
    sensor: sensor_2,
    value: {},
    data: { date: start_time.iso8601, temperature: rand(10..35), co2: rand(100..1500) },
    reported_at: start_time
  )

  start_time += 15.minutes
end

sensor_3 = Sensor.create(
  name: 'sensor_3',
  school: test_school,
  device: 'decentlab_dl_pm',
  status: :active,
  battery_level: rand(0..255)
)

start_time = 1.week.ago.beginning_of_day

while start_time < Time.zone.now.utc
  SensorSync.create(
    sensor: sensor_3,
    value: {},
    data: {
      date: start_time.iso8601,
      air_temperature: rand(-25..35),
      pm1_0_mass_concentration: rand(0..100),
      pm2_5_mass_concentration: rand(0..100),
      pm4_0_mass_concentration: rand(0..100),
      pm10_0_mass_concentration: rand(0..100),
      pm0_5_number_concentration: rand(0..100),
      pm1_0_number_concentration: rand(0..100),
      pm2_5_number_concentration: rand(0..100),
      pm4_0_number_concentration: rand(0..100),
      pm10_0_number_concentration: rand(0..100)
    },
    reported_at: start_time
  )

  start_time += 15.minutes
end

sensor_4 = Sensor.create(
  name: 'sensor_4',
  school: test_school,
  device: 'yosensi_agri_box',
  status: :active,
  battery_level: rand(0..255)
)

start_time = 1.week.ago.beginning_of_day

while start_time < Time.zone.now.utc
  SensorSync.create(
    sensor: sensor_4,
    value: {},
    data: {
      date: start_time.iso8601,
      probe1: rand(0..100.0).round(2),
      probe2: rand(0..100.0).round(2),
      probe3: rand(0..100.0).round(2)
    },
    reported_at: start_time
  )

  start_time += 15.minutes
end

Integration.create([
                     {
                       name: 'Food waste Helsingborg',
                       key: 'food_waste_helsingborg',
                       settings: { enhetKod: 'string' },
                       url: 'https://matsvinn.helsingborg.se/api/v1/matsvinn/hamta'
                     },
                     {
                       name: 'School food menu',
                       key: 'school_food_menu',
                       settings: { school: 'string', client: 'string' },
                       url: 'https://skolmaten.se/api/3/menu/'
                     },
                     {
                       name: 'Oresundskraft (energy consumption)',
                       key: 'oresundskraft',
                       settings: { 'Ocp-Apim-Subscription-Key': 'string', customerNumber: 'string',
                                   meteringPoint: 'string' },
                       url: 'https://oows.oresundskraft.se/ConsumptionExternal/api/Consumption/TimeSeries/Customers'
                     },
                     {
                       name: 'Luma energy (solar panels)',
                       key: 'luma_energy',
                       settings: { system_ids: 'string', api_key: 'string' },
                       url: 'https://api.powercloudplatform.com/systems/series/energy'
                     },
                     {
                       name: 'Weather Helsingborg',
                       key: 'weather_helsingborg',
                       settings: {}
                     },
                     {
                       name: 'Footprint calculator',
                       key: 'footprint_calculator',
                       settings: {},
                       url: 'https://openfootprint.ducky.eco/'
                     }
                   ])

SchoolIntegration.create([
                           {
                             school: test_school,
                             integration: Integration.find_by(key: 'food_waste_helsingborg'),
                             settings: { enhetKod: '' },
                             status: :active
                           },
                           {
                             school: test_school,
                             integration: Integration.find_by(key: 'school_food_menu'),
                             settings: { school: '', client: '' },
                             status: :active
                           },
                           {
                             school: test_school,
                             integration: Integration.find_by(key: 'oresundskraft'),
                             settings: { 'Ocp-Apim-Subscription-Key': '',
                                         customerNumber: '', meteringPoint: '' },
                             status: :active
                           },
                           {
                             school: test_school,
                             integration: Integration.find_by(key: 'luma_energy'),
                             settings: { system_ids: '',
                                         api_key: '' },
                             status: :active
                           },
                           {
                             school: test_school,
                             integration: Integration.find_by(key: 'weather_helsingborg'),
                             status: :active
                           },
                           {
                             school: test_school,
                             integration: Integration.find_by(key: 'footprint_calculator'),
                             status: :active
                           }
                         ])

food_waste_helsingborg_school_integration =
  SchoolIntegration.find_by(integration: Integration.find_by(key: 'food_waste_helsingborg'))
start_time = Time.zone.now.utc.beginning_of_day

21.times do |i|
  next if (start_time - i.days).wday.zero? || (start_time - i.days).wday == 6

  SchoolIntegrationSync.create(
    school_integration: food_waste_helsingborg_school_integration,
    data: {
      waste_in_g: rand(500..1000),
      waste_in_g_per_person: [8, 15, 25].sample,
      date: (start_time - i.days).iso8601,
      attendees_count: rand(100..200)
    },
    data_source_key: 'food_waste_helsingborg',
    reported_at: start_time - i.days,
    status: :success
  )
end

school_food_menu_integration = Integration.find_by(key: 'school_food_menu')
school_food_menu_school_integration = SchoolIntegration.find_by(integration: school_food_menu_integration)
start_time = Time.zone.now.utc.beginning_of_week - 1.week
school_food_menu_items = [
  'Köttbullar, tomatsås, makaroner',
  'Minibouletter, sås, makaroner',
  'Korv, potatismos, ketchup',
  'Fisk, potatismos, ketchup',
  'Pasta, köttfärssås, ost',
  'Pasta, tomatsås, ost',
  'Pasta, kycklingsås, ost'
]

21.times do |i|
  next if (start_time + i.days).wday.zero? || (start_time + i.days).wday == 6

  SchoolIntegrationSync.create(
    school_integration: school_food_menu_school_integration,
    data: {
      date: (start_time + i.days).iso8601,
      items: school_food_menu_items.sample(2)
    },
    reported_at: start_time + i.days,
    data_source_key: 'school_food_menu',
    status: :success
  )
end

oresundskraft_school_integration =
  SchoolIntegration.find_by(integration: Integration.find_by(key: 'oresundskraft'))
start_time = 1.week.ago.beginning_of_day

while start_time < Time.zone.now.utc
  SchoolIntegrationSync.create(
    school_integration: oresundskraft_school_integration,
    data: {
      date: start_time.iso8601,
      kwh: rand(0..100)
    },
    reported_at: start_time,
    data_source_key: 'oresundskraft',
    status: :success,
    ducky: {
      'convert' => {
        'energy' => { 'electricity' => { 'co2e' => 133.609 } }
      },
      'translate' => {
        'car' => [
          {
            'value' => 456.62100456621005,
            'unit' => 'km',
            'translation' => {
              'actualDistance' => 403,
              'unit' => 'km',
              'destinationA' => 'London',
              'destinationB' => 'Glasgow',
              'vehicle' => 'gasoline_car'
            }
          },
          {
            'value' => 456.62100456621005,
            'unit' => 'km',
            'translation' => {
              'actualDistance' => 464,
              'unit' => 'km',
              'destinationA' => 'London',
              'destinationB' => 'Paris',
              'vehicle' => 'gasoline_car'
            }
          }
        ],
        'energy' => [
          {
            'value' => 318.47133757961785,
            'unit' => 'kWh',
            'translation' => {
              'applianceUnit' => 'years',
              'quantity' => 1.04,
              'appliance' => 'bærbar PC'
            }
          },
          {
            'value' => 318.47133757961785,
            'unit' => 'kWh',
            'translation' => {
              'applianceUnit' => 'months',
              'quantity' => 2.72,
              'appliance' => 'stasjonær PC'
            }
          },
          {
            'value' => 318.47133757961785,
            'unit' => 'kWh',
            'translation' => {
              'applianceUnit' => 'days',
              'quantity' => 6.42,
              'appliance' => 'husholdnings energiforbruk'
            }
          }
        ],
        'plane' => [
          {
            'value' => 352.11267605633805,
            'unit' => 'km',
            'translation' => {
              'actualDistance' => 391,
              'unit' => 'km',
              'destinationA' => 'Oslo',
              'destinationB' => 'Trondheim',
              'flightType' => 'local_flight'
            }
          },
          {
            'value' => 352.11267605633805,
            'unit' => 'km',
            'translation' => {
              'actualDistance' => 416,
              'unit' => 'km',
              'destinationA' => 'Oslo',
              'destinationB' => 'Stockholm',
              'flightType' => 'local_flight'
            }
          },
          {
            'value' => 352.11267605633805,
            'unit' => 'km',
            'translation' => {
              'actualDistance' => 410,
              'unit' => 'km',
              'destinationA' => 'Paris',
              'destinationB' => 'Geneva',
              'flightType' => 'local_flight'
            }
          }
        ],
        'tree' => {
          'value' => 2040.816326530612,
          'unit' => 'm2 per year'
        }
      }
    }
  )

  start_time += 1.day
end

test_school_home_page = Page.create(name: 'Test School', school: test_school,
                                             home_page: true)

Section.create(name: 'Food tracker', page: Page.find_by(name: 'Test School'), theme: 'food_tracker', sn: 0)
Section.create(name: 'Plant care', page: Page.find_by(name: 'Test School'), theme: 'plant_care', sn: 1)
Section.create(name: 'Environmental monitor', page: Page.find_by(name: 'Test School'),
               theme: 'environmental_monitor', sn: 2)
Section.create(name: 'Electricity meter', page: Page.find_by(name: 'Test School'),
               theme: 'electricity_meter', sn: 3)
Section.create(name: 'Footprint calculator', page: Page.find_by(name: 'Test School'),
               theme: 'footprint_calculator', sn: 4, school_page: false)
Section.create(name: 'Class 1', page: Page.find_by(name: 'Test School'), sn: 0, link: true)

Widget.create([
                {
                  data_source: food_waste_helsingborg_school_integration,
                  page: test_school_home_page,
                  section: Section.find_by(name: 'Food tracker'),
                  data_source_key: 'food_waste_helsingborg',
                  sn: 0
                },
                {
                  data_source: school_food_menu_school_integration,
                  page: test_school_home_page,
                  section: Section.find_by(name: 'Food tracker'),
                  data_source_key: 'school_food_menu',
                  sn: 1
                },
                {
                  data_source: oresundskraft_school_integration,
                  page: test_school_home_page,
                  section: Section.find_by(name: 'Electricity meter'),
                  data_source_key: 'oresundskraft',
                  sn: 0
                },
                {
                  data_source: sensor_4,
                  page: test_school_home_page,
                  section: Section.find_by(name: 'Plant care'),
                  data_source_key: 'yosensi_agri_box',
                  sn: 0
                },
                {
                  data_source: sensor_3,
                  page: test_school_home_page,
                  section: Section.find_by(name: 'Environmental monitor'),
                  data_source_key: 'decentlab_dl_pm/air_temperature',
                  sn: 0
                },
                {
                  data_source: sensor_3,
                  page: test_school_home_page,
                  section: Section.find_by(name: 'Environmental monitor'),
                  data_source_key: 'decentlab_dl_pm/pm2_5_mass_concentration',
                  sn: 1
                },
                {
                  data_source: sensor_3,
                  page: test_school_home_page,
                  section: Section.find_by(name: 'Environmental monitor'),
                  data_source_key: 'decentlab_dl_pm/pm10_0_mass_concentration',
                  sn: 2
                },
                {
                  data_source: SchoolIntegration.find_by(integration: Integration.find_by(key: 'weather_helsingborg')),
                  page: test_school_home_page,
                  section: Section.find_by(name: 'Environmental monitor'),
                  data_source_key: 'weather_helsingborg',
                  sn: 3
                },
                {
                  data_source: sensor_1,
                  page: test_school_home_page,
                  section: Section.find_by(name: 'Class 1'),
                  data_source_key: 'elsys_ers_sound/noise_level_average',
                  sn: 0
                },
                {
                  data_source: sensor_2,
                  page: test_school_home_page,
                  section: Section.find_by(name: 'Class 1'),
                  data_source_key: 'elsys_ers_co2/temperature',
                  sn: 1
                },
                {
                  data_source: sensor_2,
                  page: test_school_home_page,
                  section: Section.find_by(name: 'Class 1'),
                  data_source_key: 'elsys_ers_co2/co2',
                  sn: 2
                },
                {
                  data_source: SchoolIntegration.find_by(integration: Integration.find_by(key: 'footprint_calculator')),
                  page: test_school_home_page,
                  section: Section.find_by(name: 'Footprint calculator'),
                  data_source_key: 'footprint_calculator',
                  sn: 0
                }
              ])
