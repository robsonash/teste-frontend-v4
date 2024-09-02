// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import * as labsComponents from 'vuetify/labs/components'
const vuetify = createVuetify({
  components: {
    ...components,
    ...labsComponents
  },
  directives,
  icons: {
    defaultSet: 'mdi'
  },
  defaults: {
    VBtn: {
      variant: 'tonal'
    }
  }
})

export default vuetify
