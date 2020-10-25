import { filter, map, reduce, zip, fromPairs, assign, cloneDeep } from 'lodash'

export class TableHelpers {
  public static generateOptions(page: number, perPage: number, initialSortBy: string) {
    return {
      page,
      itemsPerPage: perPage,
      sortBy: [initialSortBy],
      sortDesc: [true],
      mustSort: false,
      multiSort: true,
      search: '',
    }
  }

  public static generateHeaders(headers: Record<string, string>) {
    const result: Array<{ text: string; value: string; show: boolean; width?: string }> = []

    for (const value in headers) {
      result.push({
        text: headers[value],
        value,
        show: true,
        /* width: `${headers[value].length * 1.5}rem`, */
      })
    }

    return result
  }

  public static excludeNotShownHeaders(headers: Array<{ text: string; value: string; show: boolean }>) {
    return filter(headers, (e) => e.show)
  }

  public static normalizeResponse(response: Record<string, any> | null, include: string[]) {
    const template = (element: Record<string, any>) =>
      reduce(
        map(include, (e) => ({
          [e]: element[e],
        })),
        (a, e) => {
          return assign(a, e)
        },
        {},
      )
    return map(response, (e) => template(e))
  }

  public static processQuery(options: any) {
    const query: any = {
      page: options.page,
      limit: options.itemsPerPage,
    }

    if (options.search) {
      query.search = options.search
    }

    const sortDesc = map(options.sortDesc, (e) => (e ? 'desc' : 'asc'))

    query.sort = fromPairs(zip(options.sortBy, sortDesc))

    return query
  }

  public static changeHeaderVisibility(headers: any, payload: { header: string; value: boolean }) {
    const copy = cloneDeep(headers)
    for (const key in copy) {
      if (copy[key]['value'] === payload.header) {
        copy[key]['show'] = payload.value
      }
    }
    return copy
  }
}
