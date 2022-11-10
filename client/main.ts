import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import { L } from 'vue2-leaflet';
// import * as VueGoogleMaps from './vue-google-maps';

Vue.config.productionTip = false;

// Vue.use(VueGoogleMaps, {
//   load: {
//     key: 'AIzaSyAf6xUejyiI1ZDy2fVYr1t7G2se_TIxnvY',
//     libraries: 'places',
//   }
// });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
