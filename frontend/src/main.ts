/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp, provide, h } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './apollo/client'

const app = createApp({
    setup () {
      provide(DefaultApolloClient, apolloClient)
    },
  
    render: () => h(App),
  })

registerPlugins(app)

app.mount('#app')
