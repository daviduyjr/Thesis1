<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(addProd)">
      <div class="row">
        <div
          v-if="checkStocks()"
          class="col-12 text-danger"
          style="font-size:20px"
        >
          <label>{{ msg }}</label>
          <b-icon-exclamation-triangle-fill
            variant="danger"
            animation="fade"
          ></b-icon-exclamation-triangle-fill>
        </div>
        <div class="col-6">
          <small class="">Product ID</small>
          <input
            size="sm"
            type="text"
            class="form-control inputOrderList"
            id="prodId"
            v-model="prodId"
            disabled
          />
        </div>
        <div class="col-6">
          <small class="">Product Name</small>
          <input
            size="sm"
            type="text"
            class="form-control inputOrderList"
            id="prodName"
            v-model="prodName"
            disabled
          />
        </div>
        <div class="col-6">
          <small class="">Category</small>
          <input
            size="sm"
            type="text"
            class="form-control inputOrderList"
            id="category"
            v-model="category"
            disabled
          />
        </div>
        <div class="col-6">
          <small class="">SRP</small>
          <input
            size="sm"
            type="text"
            class="form-control inputOrderList"
            id="SRP"
            v-model="SRP"
            disabled
          />
        </div>
        <div class="col-6">
          <small class="">Stock on Hand</small>
          <input
            size="sm"
            type="text"
            class="form-control inputOrderList"
            id="stock"
            v-model="stock"
            disabled
          />
        </div>

        <div class="col-6">
          <ValidationProvider
            name="Quantity"
            rules="checkQuantity|required|numeric"
            v-slot="quantityChecker"
          >
            <small class="">Quantity</small>
            <input
              size="sm"
              type="text"
              class="form-control inputOrderList"
              id="quantity"
              v-model="quantityOfOrder"
              :state="getValidationState(quantityChecker)"
              autocomplete="off"
            />
            <div class="text-danger">
              <small> {{ quantityChecker.errors[0] }}</small>
            </div>
          </ValidationProvider>
        </div>
        <div class="col-12" style="padding-top: 5px; padding-bottom: 0px">
          <b-button
            type="submit"
            class="float-right"
            pill
            variant="outline-primary"
            :disabled="addBtnDisabled"
          >
            Add</b-button
          >
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
/* eslint-disable */
import { VMoney } from "v-money";
import { extend } from "vee-validate";
import JQuery from "jquery";
import { mapActions } from "vuex";
let $ = JQuery;

extend("checkQuantity", {
  validate(value) {
    const stocks = document.getElementById("stock").value;

    if (Number(value) > Number(stocks)) {
      return false;
    }
    return true;
  },
  message: "{_field_} is invalid."
});
export default {
  directives: { money: VMoney },
  name: "productOutLookComp",
  props: ["product"],
  data() {
    return {
      prodId: "",
      prodName: "",
      category: "",
      categoryId: "",
      SRP: "",
      stock: "",
      quantityOfOrder: "",
      msg: "",
      order: {},
      addBtnDisabled: false
    };
  },
  mounted() {
    this.getSelectedProd();
    this.checkStocks();
  },
  methods: {
    ...mapActions(["setOrderList"]),
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    getSelectedProd() {
      this.prodId = this.product.prod_id;
      this.prodName = this.product.prodName;
      this.category = this.product.category_name;
      this.categoryId = this.product.category_id;
      this.SRP = this.convertToPeso(
        Number(this.product.SRP.replace(/\,/g, ""))
      );
      this.stock = this.product.stock_onhand;
    },
    checkStocks() {
      if (Number(this.stock) < 1) {
        this.msg = "Out of Stocks.";
        this.addBtnDisabled = true;
        return true;
      }
      if (Number(this.stock) <= 10) {
        this.msg = "Low Stocks.";
        this.addBtnDisabled = false;
        return true;
      }
      this.addBtnDisabled = false;

      return false;
    },
    convertToPeso(amount) {
      const Peso = amount.toLocaleString("en-PH", {
        style: "currency",
        currency: "Php"
      });
      return Peso;
    },

    async addProd() {
      const order = await {
        id: this.prodId,
        product_name: this.prodName,
        SRP: this.SRP,
        category_name: this.category,
        category_id: this.categoryId,
        stock_onhand: this.stock,
        quantity: this.quantityOfOrder
      };
      await this.setOrderList(order);
      this.$bvModal.hide("prodOutLook");
    }
  }
};
</script>

<style scoped></style>
