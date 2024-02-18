import Vue from 'vue'
import ParentComponent from '../src/ParentComponent.vue'

new Vue({
  render: h => h(ParentComponent)
}).$mount('#app')
