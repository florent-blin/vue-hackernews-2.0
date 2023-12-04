import Vue from 'vue'
import App from './App.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
import titleMixin from './util/title'
import * as filters from './util/filters'
import VueLogger from 'vuejs-logger'

const options = {
  // optional : defaults to true if not specified
  isEnabled: true,
  // required ['debug', 'info', 'warn', 'error', 'fatal']
  logLevel : 'debug',
  // optional : defaults to false if not specified
  stringifyArguments : true,
  // optional : defaults to false if not specified
  showLogLevel : true,
  // optional : defaults to false if not specified
  showMethodName : true,
  // optional : defaults to '|' if not specified
  separator: ' ',
  // optional : defaults to false if not specified
  showConsoleColors: true
}

Vue.use(VueLogger, options)
//var winston = require('../config/winston');

// mixin for handling title
Vue.mixin(titleMixin)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp () {
  // create store and router instances
  const store = createStore()
  const router = createRouter()

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router)

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    router,
    store,
    render: h => h(App),
    created() {
      this.$log.debug('debug', 'debug')
      this.$log.info('info', 'info')
      this.$log.warn('warn', 'warn')
      this.$log.error('error', 'error')
      this.$log.fatal('fatal', 'fatal')
      //externalFunction()
    }
  })

  //app.$log.debug("app created")
  //var winston = require('winston');
  //winston.log('info', 'Hello distributed log files!');
  //winston.info('Hello again distributed logs');

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, router, store }
}
