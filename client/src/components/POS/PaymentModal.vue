<template>
  <section>
    <div class="row">
      <div class="col-12">
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(onSubmit)">
            <ValidationProvider name="Total">
              <div class="col-12">
                <small class="">Total Amount Due</small>
                <input
                  size="sm"
                  type="text"
                  class="form-control mt-1"
                  id="totalDue"
                  v-model="totalDue"
                  v-money="money"
                  disabled
                />
              </div>
            </ValidationProvider>

            <div class="col-12">
              <ValidationProvider
                name="Cash"
                rules="checkValid:@Total"
                v-slot="markUpVal"
              >
                <small class="">Cash</small>
                <b-form-input
                  id="cash"
                  name="cash"
                  type="text"
                  v-model="cash"
                  aria-describedby="prodNameFeedBack"
                  :state="getValidationState(markUpVal)"
                  autocomplete="off"
                  v-money="money"
                  v-on:keyup="getChange"
                ></b-form-input>
                <!-- v-on:input="inputCash" -->
                <div class="text-danger">
                  <small> {{ markUpVal.errors[0] }}</small>
                </div>
              </ValidationProvider>
            </div>
            <div class="col-12">
              <small class="">Change</small>
              <input
                size="sm"
                type="text"
                class="form-control mt-1"
                id="cashChange"
                v-model="cashChange"
                v-money="money"
                disabled
              />
            </div>
            <div class="col-12 mt-3">
              <b-button
                type="submit"
                class="btn-block"
                pill
                variant="outline-primary"
                >Pay</b-button
              >
            </div>
          </form>
        </ValidationObserver>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import { VMoney } from "v-money";
import { mapActions } from "vuex";
import { extend } from "vee-validate";
import JQuery from "jquery";
let $ = JQuery;

extend("customRequired", {
  validate(value) {
    const unit = value.replace(/\D+/g, "");

    if (unit === "000") {
      return false;
    } else {
      return true;
    }
  },
  message: "{_field_} field is required."
});

extend("checkValid", {
  params: ["target"],
  validate(value, { target }) {
    const totalDue = Number(target.replace(/\₱|,/g, ""));

    const cash = Number(value.replace(/\₱|,/g, ""));

    if (cash < totalDue) {
      return false;
    } else {
      return true;
    }
  },
  message: "{_field_} is insufficient."
});

export default {
  directives: { money: VMoney },
  name: "paymentModal",
  components: {},
  data() {
    return {
      totalDue: "",
      cash: "",
      id_no: "",
      cashChange: "",
      money: {
        decimal: ".",
        thousands: ",",
        prefix: "₱ ",
        suffix: "",
        precision: 2,
        masked: false
      },
      onSubmitItems: {}
    };
  },
  props: ["allData"],
  mounted() {
    this.setAllData();
  },
  computed: {},
  methods: {
    ...mapActions(["payment"]),
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    getChange() {
      const totalDue = Number(this.totalDue.replace(/\₱|,/g, ""));
      var cash = Number(this.cash.replace(/\₱|,/g, ""));
      if (cash > totalDue) {
        const change = cash - totalDue;

        this.cashChange = change.toFixed(2);
        return;
      }
      this.cashChange = 0;
    },
    setAllData() {
      this.allData.forEach(items => {
        const data = {
          orderNo: items.orderNo,
          orderList: items.orderList,
          VATSales: items.VATSales,
          VatExempt: items.VatExempt,
          VAT: items.VAT,
          discount: items.discount,
          totalDue: items.totalDue,
          adminId: items.adminId,
          customer: items.customer,
          isDiscounted: items.isDiscounted
        };

        this.onSubmitItems = data;
      });
      this.totalDue = this.onSubmitItems.totalDue;
      console.log(this.onSubmitItems);
    },
    async onSubmit() {
      const cash = Number(this.cash.replace(/\₱|,/g, ""));
      Object.assign(this.onSubmitItems, { cash: cash });
      await this.payment(this.onSubmitItems);
    }
  }
};
</script>

<style scoped>
.borderStyle {
  border: 1px solid #0000ff;
  border-radius: 10px 10px;
}
.style-chooser .vs__search::placeholder,
.style-chooser .vs__dropdown-toggle,
.style-chooser .vs__dropdown-menu {
  background: #dfe5fb;
  border: none;
  color: red;
  text-transform: uppercase;
  font-variant: small-caps;
}
</style>
