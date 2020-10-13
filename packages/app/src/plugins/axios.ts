import Vue from 'vue'
import axios from 'axios'

const baseURL =
  process.env.NODE_ENV === 'production'
    ? process.env.VUE_APP_API_URL_PRODUCTION
    : process.env.VUE_APP_API_URL_DEVELOPEMENT
const baseURLVersion =
  process.env.NODE_ENV === 'production'
    ? process.env.VUE_APP_API_VERSION_PRODUCTION
    : process.env.VUE_APP_API_VERSION_DEVELOPEMENT

const config = {
  baseURL: `${baseURL}/${baseURLVersion}`,
  validateStatus: (status: any) => {
    return status < 500 // default
  },
  timeout: 60 * 1000,
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
  function(config) {
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

_axios.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error)
  },
)

Vue.prototype.$axios = _axios

export default _axios
