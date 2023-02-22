/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import { DefaultApolloClient } from '@vue/apollo-composable'
// Composables
import { createApp, h, provide } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

import { apolloClient } from './apollo/client'
import App from './App.vue'

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
})

registerPlugins(app)

app.mount('#app')
