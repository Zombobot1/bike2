/* eslint-disable @typescript-eslint/no-var-requires */
/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// const { startDevServer } = require('@cypress/vite-dev-server')

// module.exports = (on, config) => {
//   on('dev-server:start', (options) => startDevServer({ options }))

//   return config
// }

const plugins = async (on, config) => {
  const { startDevServer } = await import('@cypress/vite-dev-server')
  on('dev-server:start', (options) => startDevServer({ options }))
  return config
}

export default plugins