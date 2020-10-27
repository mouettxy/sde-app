<template lang="pug">
v-app
  v-app-bar(dense).elevation-0
    v-app-bar-nav-icon(@click.stop='menu = true')
    v-toolbar-title {{ $t("title") }}
    v-spacer
    v-btn.text-lowercase.toolbar-logo(large, text, color='primary', href='https://sde.ru.com', target='_blank') sde

  v-navigation-drawer(v-model='menu', absolute, temporary).menu
    v-list(nav).menu-links
      v-list-item-group
        v-list-item(href='https://api.sde.ru.com/client/cabinet.php', target='_blank')
          v-list-item-title {{ $t("menu.clientCabinet") }}
        v-list-item(href='https://sde.ru.com/#contacts', target='_blank')
          v-list-item-title {{ $t("menu.contacts") }}
        v-list-item(href='https://sde.ru.com/payment', target='_blank')
          v-list-item-title {{ $t("menu.payment") }}
        v-list-item(href='https://sde.ru.com/#prices', target='_blank')
          v-list-item-title {{ $t("menu.deliveryCost") }}
    v-card(flat, :color='isDark ? "accent" : "secondary"').menu-info
      v-card-text
        .menu-info__item(:class='{"white--text": isDark}') 10.00 - 23.00
        a(href='tel:+79186619960', text, :class='{"white--text": isDark}').menu-info__item +7 (918) 661 99 60
        a(href='tel:+9786525482', text, :class='{"white--text": isDark}').menu-info__item +7 (978) 652 54 82
        .menu-info__item(:class='{"white--text": isDark}') © {{(new Date()).getFullYear()}} sde

  template(v-if='pricesOverall')
    v-scale-transition
      PriceLabel

  v-tour(name='userGuideline', :steps='tourSteps', :options='tourOptions', :callbacks='tourCallbacks')
    template(slot-scope='tour')
      v-step.blue.darken-2(
        v-for='(step, index) of tour.steps',
        v-if='tour.currentStep === index',
        :key='index',
        :step='step',
        :previous-step='tour.previousStep',
        :next-step='tour.nextStep',
        :stop='tour.stop',
        :skip='tour.skip',
        :is-first='tour.isFirst',
        :is-last='tour.isLast',
        :labels='tour.labels',
        :highlight='tour.highlight'
      )
        div(slot='header')
          v-toolbar.white--text.blue.darken-1
            v-spacer
            v-toolbar-title {{step.header.title}}
            v-spacer
        div(slot='content')
          v-card.text-center
            .text.pa-3(v-html='step.content')
            v-card-actions
              v-row
                v-col
                  template(v-if='!tour.isFirst')
                    v-btn.blue.lighten-1(@click='tour.previousStep', block, small) {{tour.labels.buttonPrevious}}
                  template(v-else)
                    v-spacer
                v-col
                  template(v-if='!tour.isLast')
                    v-btn.blue.lighten-1(@click='tour.nextStep', block, small) {{tour.labels.buttonNext}}
                  template(v-else)
                    v-spacer
        div(slot='actions')
          v-btn.blue.lighten-2(block, @click='tour.skip') {{tour.labels.buttonStop}}
  v-main
    v-container.sde-form(fluid)
      v-row.sde-row(no-gutters)
        v-col(cols='12', lg='5', md='6')
          v-tabs(
            v-model='activeTab',
            :background-color='defaultTabColor',
            :color='defaultTabTextColor',
            next-icon='mdi-arrow-right',
            prev-icon='mdi-arrow-left',
            show-arrows,
            grow
          )
            v-tab {{ $t("makeOrder") }}
            v-tab(v-if='isMobile') {{ $t("map") }}
          v-tabs-items(v-model='activeTab', touchless)
            v-tab-item
              order-view(:state='state', @state-change='onStateChange')
            v-tab-item(v-if='isMobile')
              keep-alive
                map-block
        v-col(cols='12', lg='7', md='6', v-if='!isMobile')
          keep-alive
            map-block

  v-footer.px-2(padless, fixed, app, :color='defaultFooterColor')
    v-btn(
      icon,
      :disabled='!(user && typeof user !== "string")',
      @click='defaultStartOrder',
      :content='$t("homeMapMarkerTip")',
      v-tippy
    )#tour-footer-home
      v-icon(:color='$cookies.get("fill-default-address") ? "success" : "dark"') mdi-home-map-marker
    v-btn(icon, @click='changeTheme', :content='$t("invertColorsTip")', v-tippy)#tour-footer-theme
      v-icon(:color='isDark ? "success" : "dark"') mdi-invert-colors
    v-btn#tour-footer-lang.text-uppercase(text, @click='changeLocale', :content='$t("changeLocaleTip")', v-tippy) {{$i18n.locale}}
    v-spacer
    span {{ new Date().getFullYear() }} sde
</template>

<script lang="ts">
import { colors, breakpoints } from '@/mixins'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import eventBus from '@/eventBus'

import OrderView from '@/views/OrderView.vue'
import MapBlock from '@/views/MapBlock.vue'
import PriceLabel from '@/views/PriceLabel.vue'

import { addressesModule, authModule } from '@/store'
import { filter as lodashFilter } from 'lodash'
import { OrderAddress } from './typings/order'

@Component({
  name: 'App',

  components: {
    OrderView,
    PriceLabel,
    MapBlock
  }
})
export default class App extends Mixins(colors, breakpoints) {
  public menu = false
  public state = 'filling'
  public activeTab = 1
  public tourSteps = [
    {
      target: '#tour-footer-home',
      header: { title: 'Базовые настройки' },
      content: 'Нажмите, и адрес "От нас" будет всегда выставляться из вашего аккаунта.'
    },
    {
      target: '#tour-footer-theme',
      header: { title: 'Базовые настройки' },
      content: 'Смените тему, иногда это может быть удобно!'
    },
    {
      target: '#tour-footer-lang',
      header: { title: 'Базовые настройки' },
      content: 'Смена языка / Change language.'
    },
    {
      target: '#tour-aliases',
      header: {
        title: 'Заполняйте быстрее!'
      },
      content: 'Удобный поиск по вашим сохранённым адресам.',
      params: {
        enableScrolling: false,
        placement: 'bottom'
      }
    },
    {
      target: '#tour-addresses',
      header: {
        title: 'Заполняйте быстрее!'
      },
      content: 'Удобный поиск по вашим сохранённым заявкам.',
      params: {
        enableScrolling: false,
        placement: 'bottom'
      }
    },
    {
      target: '#tour-add-address',
      header: {
        title: 'Добавление адресов'
      },
      params: {
        enableScrolling: true,
        placement: 'top'
      },
      content:
        'Добавьте адрес во всплывающем окне. Во время тура мы добавили два адреса за вас. Они будут удалены когда вы закроете тур.'
    },
    {
      target: '#tour-address-move',
      header: {
        title: 'Работа с адресами'
      },
      content: 'Изменяйте порядок адресов просто передвигая их!'
    },
    {
      target: '#tour-address-settings',
      header: {
        title: 'Работа с адресами'
      },
      content: 'Привычные вам поля адреса скрыты по умолчанию. Вы можете открыть или закрыть их по этой кнопке.'
    },
    {
      target: '#tour-preview-btn',
      header: {
        title: 'Проверьте правильность'
      },
      content: 'В предпросмотре вы можете увидеть все заполненные поля и цены. Проверьте всё ли вы заполнили верно!'
    },
    {
      target: '#tour-send-btn',
      header: {
        title: 'Отправьте заявку'
      },
      content: 'Всё правильно? Отправляйте заявку! Наши экспедиторы доставят всё точно в срок.'
    },
    {
      target: '#tour-save-btn',
      header: {
        title: 'Сохраните заявку'
      },
      content:
        'Хотите не только отправить, но и сохранить заявку для дальнейшего использования? Просто дайте ей имя во всплывающем окне, и мы сохраним её в вашем аккаунте.'
    }
  ]

  @Watch('breakpoints')
  onBreakpointsChange() {
    if (!this.isMobile) {
      this.activeTab = 0
    } else {
      this.activeTab = 1
    }
  }

  get user() {
    return authModule.user
  }

  get pricesOverall() {
    return addressesModule.prices?.overall
  }

  get tourOptions() {
    return {
      highlight: true,
      labels: {
        buttonSkip: this.$t('tour.btnSkip'),
        buttonPrevious: this.$t('tour.btnPrevious'),
        buttonNext: this.$t('tour.btnNext'),
        buttonStop: this.$t('tour.btnStop')
      }
    }
  }

  get tourCallbacks() {
    return {
      onNextStep: (curStep: number) => {
        if (curStep === 4) {
          addressesModule.addOrder({
            name: 'т 1',
            route: {
              routes: [
                {
                  to: 'ул. Гаврилова П.М., 102, Краснодар, Краснодарский край, Россия, 350020',
                  from: 'ул. имени Артюшкова, 15, Краснодар, Краснодарский край, Россия, 350016',
                  time: 8,
                  distance: 3.8,
                  timeString: '8 м.'
                }
              ],
              overallTime: 8,
              overallDistance: 3.8,
              overallTimeString: '8 м.'
            },
            addressInfo: {
              car: false,
              quick: false,
              comment: 'Заявка из тура по форме.',
              whoPays: 'Заказчик'
            },
            addressList: [
              {
                id: 1,
                lat: '45.0675184',
                lon: '39.0143587',
                name: 'От нас / К нам',
                fields: {
                  bus: false,
                  buyin: 0,
                  phone: '+7 (905) 627-75-08',
                  buyout: 0,
                  takeIn: false,
                  bundles: 0,
                  comment: 'Главный офис SDE',
                  takeOut: true,
                  datetime: '18.09.2020 14:53'
                },
                address: 'г Краснодар, ул им. Артюшкова В.Д., д 15',
                isAlias: true
              },
              {
                id: 2,
                lat: '45.0534018',
                lon: '38.9847118',
                fields: {
                  bus: false,
                  buyin: 0,
                  phone: '',
                  buyout: 0,
                  takeIn: true,
                  bundles: 0,
                  comment: '',
                  takeOut: false,
                  datetime: '18.09.2020 15:28'
                },
                address: 'г Краснодар, ул им. Гаврилова П.М., д 100',
                isAlias: false
              }
            ]
          })
        }
      },
      onSkip: () => {
        addressesModule.reset()
      }
    }
  }

  onStateChange(state: string) {
    this.state = state
  }
  isRememberedUser() {
    const cookie = this.$cookies.get('remembered-id')
    if (cookie) {
      const userId = parseInt(cookie)
      if (!isNaN(userId)) {
        return userId
      }
    }
    return false
  }
  changeLocale() {
    if (this.$i18n.locale === 'ru') {
      this.$i18n.locale = 'en'
      this.$cookies.set('locale', 'en')
    } else {
      this.$i18n.locale = 'ru'
      this.$cookies.set('locale', 'ru')
    }
  }
  defaultStartOrder() {
    if (this.$cookies.get('fill-default-address')) {
      this.$cookies.remove('fill-default-address')
      document.location.reload()
    } else {
      this.$cookies.set('fill-default-address', true)
      document.location.reload()
    }
  }
  changeTheme() {
    if (this.isDark) {
      this.$vuetify.theme.dark = false
      this.$cookies.remove('dark-theme')
    } else {
      this.$vuetify.theme.dark = true
      this.$cookies.set('dark-theme', true)
    }
  }

  async mounted() {
    if (this.$cookies.get('dark-theme') === 'true') {
      this.$vuetify.theme.dark = true
    } else {
      this.$vuetify.theme.dark = false
    }

    const isRememeredUser = this.isRememberedUser()
    if (typeof isRememeredUser === 'number') {
      await authModule.relog({ type: 'default', id: isRememeredUser })
    }

    if (!isRememeredUser && this.$cookies.get('fill-default-address')) {
      this.$cookies.remove('fill-default-address')
    }

    if (this.$cookies.get('fill-default-address')) {
      if (addressesModule.addressList.length <= 0) {
        const defaultAddress = lodashFilter(authModule.aliases, { name: 'От нас / К нам' })[0] as OrderAddress
        addressesModule.add(defaultAddress)
      }
    }

    if (this.isMobile) {
      this.activeTab = 1
      setTimeout(() => {
        this.activeTab = 0
      }, 500)
    } else {
      this.activeTab = 0
    }

    eventBus.$on('change-order-view', (val: string) => {
      this.state = val
    })
    eventBus.$on('order-sended-saved', () => {
      this.state = 'order'
    })
    eventBus.$on('order-sended', () => {
      this.state = 'order'
    })
    eventBus.$on('order-sended-error', () => {
      this.state = 'order'
    })
    eventBus.$on('address-added', (payload: any) => {
      if (payload.name !== 'От нас / К нам' && !payload.isAlias) {
        this.$notification.success(`Успешное добавление адреса ${payload.address}`)
      }
    })
  }
}
</script>

<style lang="sass">
@import './assets/main'

html
  overflow: hidden !important
  height: 100%

body
  overflow: hidden
  min-height: 100%
  width: 100%

.notificationCenter
  z-index: 999999 !important

.v-tour__target--highlighted
  box-shadow: none !important
  border: 2px solid var(--v-primary-base)

.tippy-popper
  font-family: 'Roboto' !important
  font-size: 1.1rem !important

.v-step__arrow
  border-bottom-color: var(--v-info-darken1) !important

.toolbar-logo
  font-size: 1.2rem !important

::-webkit-scrollbar
  width: 4px

/* Track */
::-webkit-scrollbar-track
  box-shadow: none
  border-radius: 0

/* Handle */
::-webkit-scrollbar-thumb
  background: #ffcc01
  border-radius: 0px

input:-webkit-autofill
  -webkit-box-shadow: 0 0 0 50px #fafafa inset
  -webkit-text-fill-color: #181818


input:-webkit-autofill:focus
  -webkit-box-shadow: 0 0 0 50px #fafafa inset
  -webkit-text-fill-color: #181818

.sde-form
  height: $height-root-sde
  padding: 0 !important

  .sde-row
    height: $height-root-sde

.menu
  .v-navigation-drawer__content
    display: flex
    justify-content: top
    flex-direction: column

  .menu-links
    flex-grow: 4

  .menu-info
    flex-grow: 1
    .menu-info__item
      display: block
      color: rgba(0, 0, 0, 0.6)
      text-decoration: none
</style>
