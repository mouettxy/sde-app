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
    saveOrder: `client/${id}/orders/`
  }),
  addresses: {
    suggestions: '/address',
    geocoder: '/3'
  },
  orders: {
    send: '/order/'
  }
}
