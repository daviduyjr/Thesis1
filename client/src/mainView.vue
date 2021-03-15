<template lang="html">
  <section class="main-view">
    <div class="container-scroller">
      <app-header />
      <div class="container-fluid page-body-wrapper">
        <app-sidebar />
        <div class="main-panel">
          <div class="content-wrapper">
            <router-view></router-view>
          </div>
          <!-- content wrapper ends -->
          <app-footer />
        </div>
        <!-- main panel ends -->
      </div>
      <!-- page-body-wrapper ends -->
    </div>
    <Toasts></Toasts>
    <loading
      :active="isLoading"
      :is-full-page="fullPage"
      :loader="loader"
      :canCancel="canCancel"
    />
  </section>
</template>

<script lang="js">
/* eslint-disable */
import AppHeader from '../src/components/partials/AppHeader'
import AppSidebar from '../src/components/partials/AppSidebar'
import AppFooter from '../src/components/partials/AppFooter'

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: 'mainView',
  components: {
    AppHeader,
    AppSidebar,
    AppFooter,
    Loading
  },
  data() {
    return {
      isLoading: false,
      fullPage: false,
      loader: "spinner",
      canCancel: false,
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.main-view {
}
</style>
