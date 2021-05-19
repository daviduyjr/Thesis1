/* eslint-disable */
<template>
  <div>
    <section class="register">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title text-center">P.O.S</h2>
              <div class="row">
                <div class="col-7"></div>
                <div class="col-5" style="border: 1px">
                  <ProductListPOS />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
/* eslint-disable */
import ProductListPOS from "../../../components/POS/ProductListPOS.vue";

export default {
  name: "mainViewPOS",
  components: { ProductListPOS }
};
</script>

<style scoped>
.card-title {
  font-size: 30px;
}
</style>
