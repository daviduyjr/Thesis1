<template>
  <section>
    <div class="wrapper">
      <div class="card" style="height: 590px;">
        <div class="card-body pt-3 pb-1">
          <div class="row">
            <div class="col-5 pl-0">
              <h2 class="orderNo float-left pt-1">Order No. {{ orderNo }}</h2>
            </div>
            <div class="col-7">
              <h2 class="card-title float-left mb-1">
                ORDER LIST
              </h2>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="row">
                <div class="col-6"></div>
              </div>
            </div>
            <div class="col-12 table-sm">
              <b-table
                class=""
                sticky-header="272px"
                :items="orders"
                :fields="table.fields"
                :busy="table.isBusy"
                :filter="table.filter"
                head-variant="dark"
                small
                bordered
                responsive
                foot-clone
                show-empty
                empty-text="No transaction."
                tbody-td-class="rowClass"
              >
                <template #cell(actions)="row">
                  <div class="row">
                    <div class="col-12 col-md-6 pr-1">
                      <b-button
                        size="sm"
                        @click="removeOrder(row.item, row.index, $event.target)"
                        class="btn-success btn-block"
                      >
                        Edit
                      </b-button>
                    </div>
                    <div class="col-12 col-md-6  pl-0">
                      <b-button
                        size="sm"
                        @click="removeOrder(row.item, row.index, $event.target)"
                        class="btn-success btn-block"
                      >
                        Delete
                      </b-button>
                    </div>
                  </div>
                </template>
                <template v-slot:empty="scope">
                  <h3 class="text-center">{{ scope.emptyText }}</h3>
                </template>
              </b-table>
            </div>
            <div class="col-12">
              <div class="row">
                <div class="col-6">
                  <div class="row">
                    <div class="col-12 borderStyle">
                      <div class="col-12  mb-1">
                        <b-form-group
                          class="mb-1 mt-1"
                          v-slot="{ ariaDescribedBy }"
                        >
                          <small class="">Discount</small>
                          <b-form-radio-group
                            @change="radioChange"
                            v-model="radioSelected"
                            :options="radioOptions"
                            :aria-describedby="ariaDescribedBy"
                            name="radioDiscount"
                          ></b-form-radio-group>
                        </b-form-group>
                      </div>
                      <div class="col-12" v-if="this.customer.id_no">
                        <div class="form-group-row">
                          <label for="" class="col-4 px-0 customerNameLabel"
                            >ID:</label
                          >
                          <strong class="">{{ this.customer.id_no }}</strong>
                        </div>
                        <div class="form-group-row">
                          <label for="" class="col-4 px-0 customerNameLabel"
                            >Name:</label
                          >
                          <strong class="">{{
                            this.customer.full_name
                          }}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="row">
                    <div class="form-group col-md-6 mb-1">
                      <small class="">VAT Sales</small>
                      <input
                        size="sm"
                        type="text"
                        class="form-control inputOrderList"
                        id="inputPassword"
                        v-model="subTotal"
                        v-money="money"
                        disabled
                      />
                    </div>
                    <div class="form-group col-md-6 mb-1">
                      <small class="">VAT(12%)</small>
                      <input
                        size="sm"
                        type="text"
                        class="form-control inputOrderList"
                        id="VAT"
                        v-model="VAT"
                        v-money="money"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="form-group col-md-6 mb-1"></div>
                    <div class="form-group col-md-6 mb-1">
                      <small class="">Total Amount Due</small>
                      <input
                        size="sm"
                        type="text"
                        class="form-control inputOrderList mt-1"
                        id="totalDue"
                        v-model="totalDue"
                        v-money="money"
                        disabled
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="form-group col-md-6 mb-1"></div>
                    <div class="form-group col-md-6 mt-2">
                      <div class="col-12">
                        <b-button
                          @click="checkout"
                          class="btn-block"
                          pill
                          variant="outline-primary"
                        >
                          Checkout</b-button
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      hide-footer
      id="orderExist"
      title="Warning!"
      ref="emptyOrderWarningModal"
      header-bg-variant="danger"
      :header-text-variant="modal.headerTextVariant"
      size="sm"
    >
      <div class="col-12" style="font-size:20px">
        <label>No transaction</label>
        <b-icon-exclamation-triangle-fill
          variant="danger"
          animation="fade"
        ></b-icon-exclamation-triangle-fill>
      </div>
    </b-modal>
    <b-modal
      hide-footer
      id="paymentModal"
      title="Warning!"
      ref="paymentModal"
      :header-bg-variant="modal.headerBgVariant"
      :header-text-variant="modal.headerTextVariant"
      size="md"
    >
      <PaymentModal />
    </b-modal>
    <b-modal
      hide-footer
      id="discountModal"
      title="Discount"
      ref="discountModal"
      :header-bg-variant="modal.headerBgVariant"
      :header-text-variant="modal.headerTextVariant"
      size="md"
    >
      <DiscountModal
        @customerSelected="customerSelected"
        v-bind:type="this.radioSelected"
      />
    </b-modal>
  </section>
</template>

<script>
/* eslint-disable */
import JQuery from "jquery";
import { mapActions } from "vuex";
import { VMoney } from "v-money";

import PaymentModal from "../POS/PaymentModal";
import DiscountModal from "../POS/DiscountModal";

let $ = JQuery;
export default {
  directives: { money: VMoney },
  name: "orderList",
  components: { PaymentModal, DiscountModal },
  data() {
    return {
      formIsNotSaved: false,
      orderNo: "",
      orders: [],
      subTotal: "",
      VAT: "",
      totalDue: "",
      options: [{ value: "", text: "Select Category" }],
      filters: {
        selectCatName: ""
      },
      customer: {
        id_no: "",
        full_name: ""
      },
      table: {
        filter: "",
        headVariant: "dark",
        sortDesc: true,
        fixed: true,
        stickyHeader: true,
        perPage: 5,
        currentPage: 1,
        isBusy: false,
        small: true,
        sortBy: "product_name",
        pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
        fields: [
          {
            key: "id",
            label: "Item Code",
            sortable: true
          },
          {
            key: "product_name",
            label: "Products Name",
            sortable: true
          },
          {
            key: "quantity",
            label: "PCS",
            sortable: false
          },
          {
            key: "SRP",
            label: "Unit Price",
            sortable: false
          },
          {
            key: "total",
            label: "Total",
            sortable: false
          },

          { key: "actions", label: "Actions" }
        ],
        sortDirection: "desc"
      },
      money: {
        decimal: ".",
        thousands: ",",
        prefix: "₱ ",
        suffix: "",
        precision: 2,
        masked: false
      },
      modal: {
        headerBgVariant: "dark",
        headerTextVariant: "light"
      },
      radioSelected: "none",
      radioOptions: [
        { text: "None", value: "none" },
        { text: "Senior", value: "senior" },
        { text: "PWD", value: "PWD" }
      ]
    };
  },
  props: ["toOrder"],
  mounted() {
    this.checkOrder;
  },
  watch: {
    checkOrder(val) {
      this.watchOrderList(val);
    }
  },
  computed: {
    rows() {
      return this.orders.length;
    },
    checkOrder() {
      return this.$store.state.POS.orderList;
    }
    // orderNoState() {
    //   return this.$store.state.POS.orderNo;
    // }
  },
  mounted() {
    this.setOrderNo();
    this.getCustomerList();
    this.watchOrderList(this.checkOrder);
  },
  methods: {
    ...mapActions([
      "productList",
      "categoryList",
      "removeItem",
      "customerList"
    ]),
    watchOrderList(val) {
      console.log("checkOrder");
      let subtotalList = 0;
      this.orders = [];

      val.forEach(async prod => {
        const SRP = Number(prod.SRP.replace(/\,/g, ""));

        const totalComputation = SRP * prod.quantity;

        const total = totalComputation.toLocaleString("en-PH", {
          style: "currency",
          currency: "Php"
        });

        subtotalList += Number(total.replace(/\₱|,/g, ""));
        const test = Number(total.replace(/\₱|,/g, ""));
        //console.log("test", test);
        await this.orders.push({
          id: prod.id,
          product_name: prod.product_name,
          description: prod.description,
          quantity: prod.quantity,
          SRP: prod.SRP,
          total: total,
          category_name: prod.category_name
        });
      });
      //let subTotal = subtotalList + VAT;
      let withOutVAT = (subtotalList / 1.12) * 1;

      let VAT = subtotalList - withOutVAT;
      let subtotal = subtotalList - VAT;
      let TotalAmount = subtotal + VAT;

      //console.log(subTotal);
      this.subTotal = this.convertToPeso(subtotal);
      this.VAT = this.convertToPeso(VAT);
      this.totalDue = this.convertToPeso(TotalAmount);
      // console.log((minusToSubtotal * 100).toFixed(2));
      // this.subTotal = subTotalFinal - minusToSubtotal;
      // this.VAT = Math.round(this.subTotal * (12 / 100));
      //  this.totalDue = this.subTotal + this.VAT;

      TotalAmount = this.convertToPeso(TotalAmount);
      console.log("totalAmout", TotalAmount);
    },
    convertToPeso(amount) {
      const Peso = amount.toLocaleString("en-PH", {
        style: "currency",
        currency: "Php"
      });
      return Peso;
    },
    async setOrderNo() {
      console.log("prodListPOS");
      const orderN = await this.$store.state.POS.orderNo;
      this.orderNo = orderN;
    },
    getCustomerList() {
      this.customerList();
    },
    // rowClass(item, type) {
    //   if (item && type === "row") {
    //     if (item.released === true) {
    //       return "text-success";
    //     } else {
    //       return "text-secondary";
    //     }
    //   } else {
    //     return null;
    //   }
    // },

    removeOrder(item, index) {
      this.removeItem(index);
    },

    checkout() {
      const orderList = this.orders;

      if (orderList.length == 0) {
        this.$refs["emptyOrderWarningModal"].show();
        return;
      }
      this.$refs["paymentModal"].show();
    },

    //para sa discount
    async radioChange() {
      if (this.radioSelected == "senior") {
        this.$refs["discountModal"].show();
      }
      if (this.radioSelected == "PWD") {
        this.$refs["discountModal"].show();
      }
      if (this.radioSelected == "none") {
        this.customer.id_no = "";
        this.customer.full_name = "";
      }
    },
    customerSelected(item) {
      this.customer.id_no = item.id_no;
      this.customer.full_name = item.full_name;
      this.$bvModal.hide("discountModal");
    }
  }
};
</script>

<style scoped>
.card-title {
  font-size: 24px;
}
.orderNo {
  font-size: 19px;
}
.rowClass {
  padding: 0px !important;
}
.table-sm {
  padding: 0px;
}
.btnAdd {
  padding-left: 12px;
  margin-left: 30px;
}
.test {
  background-color: rgb(255, 122, 89);
}
.wrapper {
  position: relative;
}
.bottom {
  position: absolute;
  bottom: 12px;
  padding-right: 31px;
}
.col-form-label {
  text-align: right;
}
.cardProdList {
  padding-top: 0px !important;
}
.borderStyle {
  border: 1px solid #0000ff;
  border-radius: 10px 10px;
}
.customerNameLabel {
  max-width: 19.33333%;
  font-size: 14px;
}
</style>
