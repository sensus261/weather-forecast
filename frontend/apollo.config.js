// apollo.config.js
module.exports = {
  client: {
    service: {
      name: 'my-app',
      url: import.meta.env.VITE_GRAPHQL_ENDPOINT,
    },
    includes: ['src/**/*.vue', 'src/**/*.js'],
  },
}
