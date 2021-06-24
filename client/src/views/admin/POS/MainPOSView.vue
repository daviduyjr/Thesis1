/* eslint-disable */
<template>
  <div>
    <section class="register">
      <div class="wrapper">
        <div class=" fixed-wrapper">
          <div class="row">
            <div class="col-lg-12 grid-margin">
              <div class="row">
                <div
                  class="col-12"
                  style="padding-left: 0px; padding-right: 0px;"
                >
                  <OrderList
                    v-if="this.isMounted"
                    :productsMain="this.prodList"
                    :toOrder="this.toOrder"
                  />
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
import { mapActions } from "vuex";

import ProductListPOS from "../../../components/POS/ProductListPOS.vue";
import OrderList from "../../../components/POS/OrderList";
export default {
  name: "mainViewPOS",
  data() {
    return {
      toOrder: [],
      confirmExit: "",
      prodList: [],
      isMounted: false
    };
  },
  components: { ProductListPOS, OrderList },
  mounted() {
    this.getProductList();
  },
  methods: {
    ...mapActions(["categoryList", "productListPOS"]),

    async getProductList() {
      const result = await this.productListPOS();
      const product = await this.$store.state.POS.productList;

      this.prodList = await product;
      this.isMounted = true;
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$bvModal
      .msgBoxConfirm("Do you really want to leave? you have unsaved changes!", {
        title: "Please Confirm",
        okVariant: "danger",
        centered: true
      })
      .then(value => {
        this.confirmExit = value;
        if (value == true) {
          next();
        } else {
          next(false);
        }
      })
      .catch(err => {
        // An error occurred
      });
  }
};
</script>

<style scoped>
.card-title {
  font-size: 30px;
}
.wrapper {
  position: relative;
}
.fixed-wrapper {
  position: sticky;
}
</style>
