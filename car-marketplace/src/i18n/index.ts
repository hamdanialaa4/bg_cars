import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import bg from '../locales/bg.json'

const messages = {
  en,
  bg
}

const i18n = createI18n({
  legacy: false,
  locale: 'bg', // Default to Bulgarian
  fallbackLocale: 'en',
  messages
})

export default i18n
