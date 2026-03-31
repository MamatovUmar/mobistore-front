export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie('token')
  const currency = useCookie('currency', { default: () => 'UZS' })
  const localePath = useLocalePath()

  const api = $fetch.create({
    baseURL: config.public.apiUrl,
    onRequest({ options }) {
      const token = tokenCookie.value
      if (token) {
        options.headers.set('Authorization', `Bearer ${token}`)
      }
      options.headers.set('Accept-currency', currency.value)
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        tokenCookie.value = undefined
        await nuxtApp.runWithContext(() => navigateTo(localePath('/login')))
      } else if (response.status === 403) {
        tokenCookie.value = undefined
        await nuxtApp.runWithContext(() => navigateTo(localePath('/')))
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})
