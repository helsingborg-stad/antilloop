# frozen_string_literal: true

module Ducky
  class Sync < Service
    def initialize(school_integration_sync)
      @school_integration_sync = school_integration_sync
    end

    def call
      return errors.add(:base, I18n.t('ducky.errors.kwh_is_missing')) if kwh.blank?
      return errors.add(:base, I18n.t('ducky.errors.kgco2e_is_missing')) if kgco2e.blank?

      data!(sync)
    end

    private

    attr_reader :school_integration_sync

    def kwh
      @kwh ||= school_integration_sync.data['kwh']
    end

    # rubocop:disable Metrics/MethodLength
    def sync
      {
        'convert' => {
          'energy' => convert_energy.success? ? convert_energy.data : nil
        },
        'translate' => {
          'car' => translate_car.success? ? translate_car.data : nil,
          'energy' => translate_energy.success? ? translate_energy.data : nil,
          'plane' => translate_plane.success? ? translate_plane.data : nil,
          'tree' => translate_tree.success? ? translate_tree.data : nil
        }
      }
    end
    # rubocop:enable Metrics/MethodLength

    def convert_energy
      @convert_energy ||= Ducky.convert_energy(
        categories: [
          {
            category: 'electricity',
            amount: kwh,
            unit: 'kWh'
          }
        ]
      )
    end

    def kgco2e
      @kgco2e ||= convert_energy.success? ? convert_energy.data['electricity']['co2e'] : nil
    end

    def translate_car
      @translate_car ||= Ducky.translate_car(kgco2e:)
    end

    def translate_energy
      @translate_energy ||= Ducky.translate_energy(kgco2e:)
    end

    def translate_plane
      @translate_plane ||= Ducky.translate_plane(kgco2e:)
    end

    def translate_tree
      @translate_tree ||= Ducky.translate_tree(kgco2e:)
    end
  end
end
