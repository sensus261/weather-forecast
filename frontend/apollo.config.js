// apollo.config.js
module.exports = {
  client: {
    service: {
      name: 'my-app',
      url: 'http://localhost:3001/api',
    },
    includes: ['src/**/*.vue', 'src/**/*.js'],
  },
}
