import ItemList from './ItemList.vue'

const camelize = str => str.charAt(0).toUpperCase() + str.slice(1)

const winston = require('./../../config/winston')

// This is a factory function for dynamically creating root-level list views,
// since they share most of the logic except for the type of items to display.
// They are essentially higher order components wrapping ItemList.vue.
export default function createListView (type) {
  console.log("---------------", "createListView", type)

  //winston.info("createListView", type);
  return {
    name: `${type}-stories-view`,

    asyncData ({ store }) {
      console.log("---------------", "asyncData")
      return store.dispatch('FETCH_LIST_DATA', { type })
    },

    title: camelize(type),

    render (h) {
      return h(ItemList, { props: { type }})
    }
  }
}
