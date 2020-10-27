<template lang="pug">
GmapMap.elevation-0(
  ref='map',
  :class='{"mobile-map": isMobile, "desktop-map": !isMobile}',
  :options='mapOptions',
  :center='{lat: lat, lng: lng}'
)
</template>

<script lang="ts">
import { gmapApi } from 'gmap-vue'
import { Component, Mixins, Ref, Watch } from 'vue-property-decorator'
import { OrderAddress } from '@/typings/order'
import {
  size as lodashSize,
  cloneDeep,
  map as lodashMap,
  each as lodashEach,
  round as lodashRound,
  isUndefined,
  debounce
} from 'lodash'
import { colors, breakpoints } from '@/mixins'
import { addressesModule } from '@/store'

@Component
export default class MapBlock extends Mixins(colors, breakpoints) {
  @Ref('map') map: any
  public lat = 45.035279
  public lng = 38.97412
  public lastAddressesSize?: number = undefined

  @Watch('addresses')
  onAddressesChange(addresses: any) {
    if (addresses === undefined) {
      addressesModule.UPDATE_ROUTES(null)
    }
    if (lodashSize(addresses) !== this.lastAddressesSize) {
      this.renderRoute()
    }
  }

  get addresses() {
    return addressesModule.addresses
  }

  get mapOptions() {
    let styles: Array<any> = []
    if (this.isDark) {
      styles = [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{ color: '#263c3f' }]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#6b9a76' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#38414e' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#212a37' }]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#9ca5b3' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#746855' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#1f2835' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#f3d19c' }]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{ color: '#2f3948' }]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#17263c' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#515c6d' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#17263c' }]
        }
      ]
    }
    return {
      zoom: 12,
      disableDefaultUI: true,
      styles
    }
  }
  get google() {
    return gmapApi()
  }
  get DirectionsService() {
    return new this.google.maps.DirectionsService()
  }
  get DirectionsRenderer() {
    const a = new this.google.maps.DirectionsRenderer()
    if (this.map?.$mapObject) {
      a.setMap(this.map.$mapObject)
    }
    return a
  }

  getRoute(addresses: OrderAddress[], callback: Function) {
    const addrs: OrderAddress[] = cloneDeep(addresses)
    let origin = addrs.shift()
    let destination = addrs.pop()

    if (isUndefined(origin) || isUndefined(destination)) {
      return false
    }

    //@ts-ignore
    origin = { lat: parseFloat(origin.lat), lng: parseFloat(origin.lon) }
    //@ts-ignore
    destination = { lat: parseFloat(destination.lat as string), lng: parseFloat(destination.lon as string) }

    const waypointsCount = lodashSize(addrs)
    let waypoints: Array<any> = []

    if (waypointsCount > 0) {
      waypoints = lodashMap(addrs, (e) => {
        //@ts-ignore
        return { location: { lat: parseFloat(e.lat), lng: parseFloat(e.lon) } }
      })
    }

    if (origin && destination) {
      this.DirectionsService.route(
        {
          origin,
          waypoints,
          destination,
          travelMode: 'DRIVING'
        },
        (response: any, status: any) => {
          return callback(response, status)
        }
      )
    }
  }

  renderRoute() {
    const addressesCount = (this.lastAddressesSize = lodashSize(addressesModule.addresses))
    if (addressesCount >= 2 && !isUndefined(addressesModule.addresses)) {
      this.getRoute(addressesModule.addresses, (response: any, status: any) => {
        if (status === 'OK' && response) {
          this.DirectionsRenderer.setDirections(response)

          // making route info object
          const route = response.routes[0]
          const legs = route.legs
          const routeInfo = {
            routes: [],
            overallDistance: 0,
            overallTime: 0,
            overallTimeString: undefined
          } as any

          lodashEach(legs, (e) => {
            const distance = lodashRound(e.distance.value / 1000, 1)
            const time = lodashRound((distance / 30) * 60)
            const timeString = time >= 60 ? `${lodashRound(time / 60)}ч. ${lodashRound(time % 60)} м.` : `${time} м.`

            routeInfo.routes.push({
              from: e.start_address,
              to: e.end_address,
              distance,
              time,
              timeString
            })
            routeInfo.overallDistance += distance
            routeInfo.overallTime += time
            routeInfo.overallTimeString =
              routeInfo.overallTime >= 60
                ? `${lodashRound(routeInfo.overallTime / 60)}ч. ${lodashRound(routeInfo.overallTime % 60)} м.`
                : `${routeInfo.overallTime} м.`
          })

          addressesModule.UPDATE_ROUTES(routeInfo)
        }
      })
    }
  }

  mounted() {
    const debounced = debounce(this.renderRoute, 1000)
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'addresses/UPDATE_LIST') {
        debounced()
      }

      if (mutation.type === 'addresses/RESET_STATE') {
        this.DirectionsRenderer.set('directions', null)
      }
    })

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.lat = pos.coords.latitude
        this.lng = pos.coords.longitude
      },
      () => {
        //console.debug(err.message)
        return false
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )

    setInterval(() => {
      if (this.map) {
        if (this.map.$mapObject && this.map.$mapObject.getZoom() <= 10) {
          this.map.$mapObject.setZoom(12)
        }
      }
    }, 1000)
  }
}
</script>

<style lang="sass" scoped>
.vue-map-container
  &.mobile-map
    width: 100%
    height: $height-mobile-sde

  &.desktop-map
    width: 100%
    height: $height-root-sde
</style>
