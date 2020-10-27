import { http, dadata } from '@/plugins/axios'

export class Client {
  private endpoints = (...args: Array<string | number | boolean | Array<any> | Record<string, any>>) => {
    return {
      get: `/client/${args[0]}`,
      ping: `/client/${args[0]}/auth/ping`,
      login: `/client/auth/login`,
      token: `/client/${args[0]}/auth/token`, // TODO
      setAliases: `/client/${args[0]}/client-address`,
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
      return response.data
    } catch (error) {
      return { data: false, status: 500 }
    }
  }

  public async setAliases(id: string | number, data: any) {
    try {
      const response = await http.post(this.endpoints(id).setAliases, data)
      return response.data
    } catch (error) {
      return false
    }
  }

  public async login(login: string | number, password: string) {
    try {
      const response = await http.post(this.endpoints().login, { login, password })
      return response.data
    } catch (error) {
      return false
    }
  }

  public async token(id: string | number) {
    try {
      const response = await http.post(this.endpoints(id).token)
      return response.data
    } catch (error) {
      return false
    }
  }

  public async ping(id: string | number) {
    try {
      const response = await http.post(this.endpoints(id).ping)
      return response.data
    } catch (error) {
      return false
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

  public async send(data: any) {
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
