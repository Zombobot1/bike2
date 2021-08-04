import _ from 'lodash'
import { JSObject, JSObjectStr, str } from '../utils/types'

export const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://bike.maxvas.ru'

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export function axi<T = JSObject>(url: str, body?: JSObject | Method, method?: Method): Promise<T> {
  if (!method) {
    if (_.isString(body)) method = body as Method
    else if (!body) method = 'GET'
    else method = 'POST'
  }

  return axi_<T>(url, body as JSObject, method)
}

export function axif<T = JSObject>(url: str, form: File | FormData): Promise<T> {
  if (form instanceof File) {
    const file = form
    form = new FormData()
    form.append('file', file)
  }

  return fetch_(url, { method: 'POST', body: form })
}

// const localStorageKey = '__token__'
function axi_<T>(url: str, body?: JSObject, method?: Method, customHeaders?: JSObjectStr): Promise<T> {
  const headers: JSObjectStr = { 'content-type': 'application/json' }
  // const token = window.localStorage.getItem(localStorageKey)
  // if (token) headers.Authorization = `Bearer ${token}`

  const config: JSObject = {
    method,
    headers: {
      ...headers,
      ...customHeaders,
    },
  }

  if (body) config.body = JSON.stringify(body)

  return fetch_(url, config)
}

const fetch_ = (url: str, config: JSObject) =>
  window.fetch(`${BASE_URL}${url}`, config).then(async (response) => {
    // if (response.status === 401) {
    //   logout()
    //   window.location.assign(window.location.toString())
    //   return
    // }

    if (response.ok) return response.json()
    throw new Error(await response.text())
  })

// function logout() {
//   window.localStorage.removeItem(localStorageKey)
// }
