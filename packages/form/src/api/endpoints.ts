import { http, dadata } from '@/plugins/axios'

export class Client {
  private endpoints = (...args: Array<string | number | boolean | Array<any> | Record<string, any>>) => {
    return {
      get: `/client/${args[0]}`,
      login: `/client/${args[0]}/auth/login`,
      token: `/client/${args[0]}/auth/token`,
      setAliases: `/client/${args[0]}/client-alias`,
      setOrder: `/client/${args[0]}/client-order`,
    }
  }
  public http: any = null

  constructor(http: any) {
    if (!http) {
      throw new Error('Http client not specified')
    }

    this.http = http
  }

  public async getById(id: string | number) {
    try {
      const response = await this.http.get(this.endpoints(id).get)
      return { data: response.data, status: response.status }
    } catch (error) {
      return { data: false, status: 500 }
    }
  }

  public async setAliases(id: string | number, data: any) {
    try {
      const response = await http.post(this.endpoints(id).setAliases, data)
      return { data: response.data, status: response.status }
    } catch (error) {
      return { data: false, status: 500 }
    }
  }

  public async login(id: string | number, password: string) {
    try {
      const response = await http.post(this.endpoints(id).login, { password })
      return { data: response.data, status: response.status }
    } catch (error) {
      return { data: false, status: 500 }
    }
  }

  public async token(id: string | number) {
    try {
      const response = await http.post(this.endpoints(id).token)
      return { data: response.data, status: response.status }
    } catch (error) {
      return { data: false, status: 500 }
    }
  }

  public async setOrder(id: string | number, data: any) {
    try {
      const response = await http.post(this.endpoints(id).setOrder, data)
      if (response.status !== 200) {
        return false
      }

      return response.data
    } catch (error) {
      return false
    }
  }
}

export class Dadata {
  private endpoints = () => {
    return {
      suggestions: `/address`,
    }
  }

  public http: any = null

  constructor(http: any) {
    if (!http) {
      throw new Error('Http client not specified')
    }

    this.http = http
  }

  public async get(query: string) {
    try {
      const locations = [
        {
          region: 'Краснодарский',
        },
        {
          region: 'Адыгея',
        },
        {
          region: 'Крым',
        },
        {
          region: 'Севастополь',
        },
        {
          region: 'Санкт-Петербург',
        },
      ]
      const response = await dadata.post(this.endpoints().suggestions, {
        query,
        locations,
      })

      if (response.status === 200) {
        return response.data.suggestions
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }
}

export class Misc {
  private endpoints = () => {
    return {
      geocoder: `https://maps.googleapis.com/maps/api/geocode/json`,
    }
  }

  public http: any = null

  constructor(http: any) {
    if (!http) {
      throw new Error('Http client not specified')
    }

    this.http = http
  }

  public async geocode(query: string) {
    try {
      const response = await this.http.get(this.endpoints().geocoder, {
        params: {
          address: query,
          key: process.env.VUE_APP_GOOGLE_API_KEY,
        },
      })

      const coordinates = response.data['results'][0]['geometry']['location']

      if (!(response.status === 200) || !coordinates) {
        return false
      }

      return {
        lat: coordinates.lat,
        lon: coordinates.lng,
      }
    } catch (error) {
      return false
    }
  }
}

export class Order {
  private endpoints = () => {
    return {
      send: `/order`,
    }
  }

  public http: any = null

  constructor(http: any) {
    if (!http) {
      throw new Error('Http client not specified')
    }

    this.http = http
  }

  public async save(data: any) {
    try {
      const response = await http.post(this.endpoints().send, data)
      if (response.status !== 200) {
        return false
      }

      return response.data
    } catch (error) {
      return false
    }
  }
}

export default {
  client: (id: number | string | undefined = undefined) => ({
    get: `client/${id}`,
    aliases: `client/${id}/aliases`,
    addresses: `client/${id}/orders`,
    register: 'client/auth/register',
    login: 'client/auth/login',
    changeField: `client/${id}/field`,
    renewToken: `client/${id}/token`,
    replaceAliases: `client/${id}/aliases/replace`,
    replaceOrders: `client/${id}/orders/replace`,
    saveOrder: `client/${id}/orders/`,
  }),
  addresses: {
    suggestions: '/address',
    geocoder: '/3',
  },
  orders: {
    send: '/order/',
  },
}
