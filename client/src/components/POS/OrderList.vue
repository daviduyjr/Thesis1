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
                        @click="edit(row.item, row.index, $event.target)"
                        class="btn-success btn-block"
                      >
                        Edit
                      </b-button>
                    </div>
                    <div class="col-12 col-md-6  pl-0">
                      <b-button
                        size="sm"
                        @click="voidItem(row.item, row.index, $event.target)"
                        class="btn-success btn-block"
                      >
                        Void
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
                      <small class="">VAT Exempt</small>
                      <input
                        size="sm"
                        type="text"
                        class="form-control inputOrderList"
                        id="vatExempt"
                        v-model="vatExempt"
                        v-money="money"
                        disabled
                      />
                    </div>
                    <div class="form-group col-md-6 mb-1">
                      <small class="">VAT Sales</small>
                      <input
                        size="sm"
                        type="text"
                        class="form-control inputOrderList"
                        id="subTotal"
                        v-model="subTotal"
                        v-money="money"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="form-group col-md-6 mb-1">
                      <small class="discount">SC/PWD Discount</small>
                      <input
                        size="sm"
                        type="text"
                        class="form-control inputOrderList discount mt-1"
                        id="discount"
                        v-model="discount"
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
    <!-- modal para sa warning -->
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
    <!-- modal para payment -->
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
    <!-- modal para discount -->
    <b-modal
      hide-footer
      id="discountModal"
      title="Discount"
      ref="discountModal"
      :hide-header-close="modal.headerClose"
      :header-bg-variant="modal.headerBgVariant"
      :header-text-variant="modal.headerTextVariant"
      :no-close-on-backdrop="modal.closeOnBackdrop"
      size="md"
    >
      <div v-if="this.isDiscount">
        <DiscountModal
          @cancelDiscount="cancelDiscount"
          @customerSelected="customerSelected"
          v-bind:type="this.radioSelected"
        />
      </div>
      <div v-if="this.void">
        <VoidReasonModal v-if="this.void" />
      </div>
    </b-modal>
    <!-- modal para discount security -->
    <b-modal
      hide-footer
      :hide-header-close="modal.headerClose"
      id="securityModal"
      :title="securityModal.title"
      ref="securityModal"
      :header-bg-variant="modal.headerBgVariant"
      :header-text-variant="modal.headerTextVariant"
      :no-close-on-backdrop="modal.closeOnBackdrop"
      size="sm"
    >
      <DiscountSecurity
        @successAccess="successAccess"
        @accessDenied="accessDenied"
        @cancelSecurity="cancelSecurity"
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
import DiscountSecurity from "../POS/Security";
import VoidReasonModal from "../POS/VoidReasonModal";

let $ = JQuery;
export default {
  directives: { money: VMoney },
  name: "orderList",
  components: {
    PaymentModal,
    DiscountModal,
    DiscountSecurity,
    VoidReasonModal
  },
  data() {
    return {
      formIsNotSaved: false,
      orderNo: "",
      orders: [],
      subTotal: "",
      vatExempt: "",
      VAT: "",
      discount: "",
      totalDue: "",
      adminId: "",
      void: false,
      isDiscount: false,
      toVoid: [],
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
        headerTextVariant: "light",
        headerClose: true,
        closeOnBackdrop: true
      },
      securityModal: {
        title: "Security"
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
    edit(item) {
      console.log("edit", item);
    },
    voidItem(item, index) {
      this.void = true;
      this.isDiscount = false;
      this.toVoid.push({
        index: index,
        item: item
      });
      this.$bvModal.show("securityModal");
    },
    voidItemFinal() {
      console.log("allitem", this.toVoid);
      const item = this.toVoid.slice(-1)[0];
      this.removeItem(item.index);
    },
    checkout() {
      const orderList = this.orders;

      if (orderList.length == 0) {
        this.$refs["emptyOrderWarningModal"].show();
        return;
      }
      this.$refs["paymentModal"].show();
    },

    //pag namili ng discount radio button
    async radioChange() {
      if (this.radioSelected == "none") {
        this.customer.id_no = "";
        this.customer.full_name = "";
        return;
      }
      this.securityModal.title = "Security";
      this.$bvModal.show("securityModal");
    },
    // naka select na ng customer na eligible for discount
    customerSelected(item) {
      this.customer.id_no = item.id_no;
      this.customer.full_name = item.full_name;
      this.vatExempt = this.subTotal;
      const vatExemptSales = Number(this.subTotal.replace(/\₱|,/g, ""));
      const VAT = Number(this.VAT.replace(/\₱|,/g, ""));
      const seniorDiscount = vatExemptSales * 0.2;
      const totalDueWithDisc = vatExemptSales - seniorDiscount;

      this.VAT = this.convertToPeso(0);
      this.subTotal = this.convertToPeso(0);
      this.discount = this.convertToPeso(seniorDiscount);
      this.totalDue = this.convertToPeso(totalDueWithDisc);
      console.log(this.convertToPeso(this.totalDue));

      this.$bvModal.hide("discountModal");
    },
    //para sa security ng discount
    successAccess(userId) {
      this.modal.headerBgVariant = "dark";
      this.modal.headerTextVariant = "light";
      this.adminId = userId;
      this.$bvModal.hide("securityModal");

      if (this.radioSelected == "senior") {
        this.void = false;
        this.isDiscount = true;
        this.$refs["discountModal"].show();
        return;
      }
      if (this.radioSelected == "PWD") {
        this.isDiscount = true;
        this.$refs["discountModal"].show();
        return;
      }
      if (this.void == true) {
        //this.voidItemFinal();
        debugger;
        this.isDiscount = false;
        this.void = true;
        console.log(this.isDiscount);
        this.$refs["discountModal"].show();
      }
    },
    accessDenied() {
      this.securityModal.title = "ERROR!";
      this.modal.headerBgVariant = "danger";
    },
    //para sa pag hide ng mga modal
    cancelDiscount() {
      if (this.radioSelected != null) {
        this.$bvModal.hide("discountModal");
        this.radioSelected = "none";
        this.isDiscount = false;
        this.void = false;
        return;
      }
      this.$bvModal.hide("discountModal");
      this.radioSelected = "none";
      this.isDiscount = false;
      this.void = false;
    },
    cancelSecurity() {
      this.$bvModal.hide("securityModal");
      this.securityModal.title = "Security";
      this.modal.headerBgVariant = "dark";
      this.modal.headerTextVariant = "light";
      this.radioSelected = "none";
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
