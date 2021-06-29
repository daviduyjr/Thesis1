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
                >Pay/Print Reciept</b-button
              >
            </div>
            <div class="col-12 mt-3">
              <b-button
                @click="printInvoice"
                class="btn-block"
                pill
                variant="outline-primary"
                >Preview Reciept</b-button
              >
            </div>
          </form>
        </ValidationObserver>
      </div>
    </div>
    <b-overlay :show="busy" no-wrap @shown="onShown">
      <template #overlay>
        <div v-if="processing" class="text-center">
          <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
          <p id="cancel-label">Please wait...</p>
        </div>
        <div
          v-else
          ref="dialog"
          tabindex="-1"
          role="dialog"
          aria-modal="false"
          aria-labelledby="form-confirm-label"
          class="text-center p-3"
        >
          <p><strong id="form-confirm-label">Are you sure?</strong></p>
          <div class="d-flex">
            <b-button
              variant="outline-danger"
              class="mr-3"
              @click="onCancelConfirmation"
            >
              Cancel
            </b-button>
            <b-button variant="outline-success" @click="onSubmitFinal"
              >OK</b-button
            >
          </div>
        </div>
      </template>
    </b-overlay>
  </section>
</template>

<script>
/* eslint-disable */
import { VMoney } from "v-money";
import { mapActions } from "vuex";
import { extend } from "vee-validate";
import JQuery from "jquery";
let $ = JQuery;

import Invoice from "../POS/Invoice";
import Invoice2 from "../POS/Invoice2";

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
  components: { Invoice, Invoice2 },
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
      onSubmitItems: {},
      //para sa overlay
      busy: false,
      processing: false
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
          cashierId: items.cashierId,
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
      this.processing = false;
      this.busy = true;
    },
    async onSubmitFinal() {
      this.processing = true;
      const cash = Number(this.cash.replace(/\₱|,/g, ""));
      const change = Number(this.cashChange.replace(/\₱|,/g, ""));
      await Object.assign(this.onSubmitItems, { cash, change });

      setTimeout(async () => {
        this.processing = true;
        const res = await this.payment(this.onSubmitItems);
        if (res.data.success == true) {
          this.processing = false;
          this.busy = false;
          this.$emit("paymentSuccess", this.onSubmitItems);
        }
      }, 2000);
    },
    printInvoice() {
      console.log("printInvoice");
      const cash = this.cash;
      const change = this.cashChange;
      Object.assign(this.onSubmitItems, { cash, change });
      this.$bvModal.show("invoice");
    },
    onShown() {
      // Focus the dialog prompt
      this.$refs.dialog.focus();
    },
    onCancelConfirmation() {
      this.busy = false;
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
