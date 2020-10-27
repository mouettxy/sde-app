import Vue from 'vue'
import axios from 'axios'

const config = {
  baseURL: process.env.NODE_ENV === 'production' ? 'https://api2.sde.ru.com/v1/' : 'http://localhost:8000/v1/',
  timeout: 10000,
  validateStatus: (status: number) => {
    return status < 500
  },
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}

const dadataConfig = {
  baseURL: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest',
  headers: {
    common: {
      Authorization: `Token ${process.env.VUE_APP_DADATA_TOKEN}`,
    },
    post: {
      'Content-Type': 'application/json',
    },
  },
}

const _cleanAxios = axios.create()
const _axios = axios.create(config)
const _dadata = axios.create(dadataConfig)

_axios.interceptors.request.use(
  function (config) {
    const time = new Date().toISOString().slice(0, 19).replace(/-/g, '/').replace('T', ' ')
    // console.debug(`${time} | sending request to ${config.url}`)

    return config
  },
  function (error) {
    const time = new Date().toISOString().slice(0, 19).replace(/-/g, '/').replace('T', ' ')
    // console.debug(`${time} | error on sending request to ${config.baseURL}`, error)

    return Promise.reject(error)
  },
)

_axios.interceptors.response.use(
  function (response): any {
    const time = new Date().toISOString().slice(0, 19).replace(/-/g, '/').replace('T', ' ')
    // console.debug(`${time} | getting response`, response)

    return { data: response.data, status: response.status }
  },
  function (error) {
    const time = new Date().toISOString().slice(0, 19).replace(/-/g, '/').replace('T', ' ')
    // console.debug(`${time} | error with response`, error)

    return Promise.reject(error)
  },
)

Vue.prototype.$http = _axios

export const axiosInstance = _cleanAxios
export const http = _axios
export const dadata = _dadata
