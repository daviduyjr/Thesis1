/* eslint-disable */
<template>
  <div>
    <section class="register">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body pt-2">
              <h2 class="card-title text-center mb-1">
                P.O.S
              </h2>
              <div class="row">
                <div class="col-7">
                  <OrderList :toOrder="this.toOrder" />
                </div>
                <div
                  class="col-5"
                  style="padding-left: 0px; padding-right: 0px;"
                >
                  <ProductListPOS @clicked="addOrder" />
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
      confirmExit: ""
    };
  },
  components: { ProductListPOS, OrderList },
  mounted() {
    this.getProductList();
  },
  methods: {
    ...mapActions(["categoryList", "productListPOS"]),
    addOrder(addOrder) {
      this.toOrder.push(addOrder);
      //console.log("toOrder", this.toOrder);
    },
    async getProductList() {
      const result = await this.productListPOS();
      if (result.success === false) {
        //this.errorInList = result.msg;
      } else {
      }
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
</style>
