export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie('token')

  const api = $fetch.create({
    baseURL: config.public.apiUrl,
    onRequest({ options }) {
      const token = tokenCookie.value
      if (token) {
        options.headers.set('Authorization', `Bearer ${token}`)
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        tokenCookie.value = undefined
        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})
