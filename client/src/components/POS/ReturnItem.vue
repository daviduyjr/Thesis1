<template>
  <div>
    <section class="register">
      <div class="row">
        <div class="col-12">
          <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)">
              <div class="row">
                <div class="form-group col-5">
                  <ValidationProvider
                    name="ID"
                    rules="required"
                    v-slot="idValidation"
                  >
                    <b-input
                      v-model="id"
                      type="text"
                      size="sm"
                      class="form-control"
                      :state="getValidationState(idValidation)"
                      placeholder="Search by Transactioni No."
                      aria-describedby="idValidation"
                      autocomplete="off"
                      @blur.native="onBlur($event)"
                      @input.native="idInput()"
                      empty-text="No transaction."
                    ></b-input>
                    <div class="text-danger">
                      <small> {{ idValidation.errors[0] }}</small>
                    </div>
                  </ValidationProvider>
                </div>
                <div>
                  <b-button
                    type="submit"
                    class="btn-md"
                    variant="outline-primary"
                    >Search</b-button
                  >
                </div>
                <!-- <div class="col-5">
                  <b-form-group
                    label="Filter By: "
                    label-for="radioDiscount"
                    label-cols-sm="2"
                    label-size="sm"
                    label-align="right"
                    class=""
                    v-slot="{ ariaDescribedBy }"
                  >
                    <b-form-radio-group
                      id="radioDiscount"
                      @change="radioChange"
                      v-model="radioSelected"
                      :options="radioOptions"
                      :aria-describedby="ariaDescribedBy"
                      name="radioDiscount"
                      size="sm"
                      class="pt-1"
                    ></b-form-radio-group>
                  </b-form-group>
                </div> -->
              </div>
            </form>
          </ValidationObserver>
        </div>
        <div class="col-12">
          <div class="row">
            <div class="col-8">
              <b-table
                :items="orderList"
                :fields="table.fields"
                responsive
                sticky-header
                ref="selectableTable"
                show-empty
                style="height: 261px;"
              >
                <!-- Example scoped slot for select state illustrative purposes -->
                <template #cell(selected)="{ rowSelected }">
                  <template v-if="rowSelected">
                    <span aria-hidden="true">&check;</span>
                    <span class="sr-only">Selected</span>
                  </template>
                  <template v-else>
                    <span aria-hidden="true">&nbsp;</span>
                    <span class="sr-only">Not selected</span>
                  </template>
                </template>
                <template #cell(actions)="row">
                  <template v-if="row.item.isVoid"></template>
                  <b-form-checkbox
                    v-model="row.item.check"
                    @input="checkboxSelected($event, row.index, row.item)"
                    :disabled="checkifDisabled(row.index, row.item)"
                  >
                  </b-form-checkbox>
                </template>
                <template v-slot:empty="scope">
                  <h3 class="text-center">{{ scope.emptyText }}</h3>
                </template>
              </b-table>
            </div>
            <div class="col-4">
              <div class="row">
                <div class="col-12">
                  <div v-if="this.isDiscount" class="row mx-1 borderStyle">
                    <small class="">Customer Info</small>
                    <div class="col-12 px-0" v-if="this.customer.id_no">
                      <div class="row">
                        <div class="col-5 pr-0">
                          <div class="form-group-row">
                            <label for="" class="col-2 px-0 customerNameLabel"
                              >ID:</label
                            >
                            <strong class="">{{ this.customer.id_no }}</strong>
                          </div>
                        </div>
                        <div class="col-7 pr-0">
                          <div class="form-group-row">
                            <label for="" class="col-3 px-0 customerNameLabel"
                              >Name:</label
                            >
                            <strong class="">{{
                              this.customer.full_name
                            }}</strong>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6">
                          <div class="form-group-row">
                            <label for="" class="col-3 px-0 customerNameLabel"
                              >Type:</label
                            >
                            <strong class="">{{
                              this.customer.custType
                            }}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                    id="VATSales"
                    v-model="VATSales"
                    v-money="money"
                    disabled
                  />
                </div>
              </div>
              <div class="row">
                <div class="form-group col-md-6 col-sm-6 mb-1">
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

                <div class="form-group col-md-6 col-sm-6  mb-1">
                  <small class="">VAT(12%)</small>
                  <input
                    size="sm"
                    type="text"
                    class="form-control inputOrderList mt-1"
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
                  <small class="col-xs-12">Total Amount Due</small>
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
            </div>
          </div>
        </div>
        <div class="col-12 pr-0">
          <div class="row">
            <div class="form-group row col-md-6 col-sm-6  mb-1">
              <label class="col-sm-2 col-form-label" for="refundTotal">
                <small>Refund Total</small>
              </label>
              <div class="col-8">
                <input
                  size="sm"
                  type="text"
                  class="form-control inputOrderList mt-1"
                  id="refundTotal"
                  v-model="refundTotal"
                  v-money="money"
                  disabled
                />
                <div v-if="this.errMsg" class="text-danger">
                  <small> {{ this.errMsg }}</small>
                </div>
              </div>
            </div>
            <div class="col-4"></div>
            <div class="col-2">
              <b-button
                @click="refundBtn()"
                class="btn-block m-2 float-left"
                pill
                variant="outline-primary"
                >Refund</b-button
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
/* eslint-disable */
import { VMoney } from "v-money";
import { mapActions } from "vuex";

export default {
  directives: { money: VMoney },
  name: "returnItem",
  data() {
    return {
      id: "",
      orderList: [],
      VATSales: "",
      vatExempt: "",
      VAT: "",
      discount: "",
      totalDue: "",
      isDiscount: false,
      refundTotal: "",
      customer: {
        id_no: "",
        full_name: "",
        custType: ""
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
        selectMode: "multi",
        selected: [],
        toRefund: {},
        priceNoDiscount: {
          VATSales: "",
          VAT: "",
          totalDue: ""
        },
        fields: [
          { key: "actions", label: "Actions" },
          // {
          //   key: "selected",
          //   label: "Selected"
          // },
          {
            key: "prodId",
            label: "Item Code",
            sortable: true
          },
          {
            key: "productName",
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

          { key: "isVoid", label: "Void" }
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
      errMsg: ""
      // radioSelected: "SENIOR",
      // radioOptions: [
      //   { text: "SENIOR", value: "SENIOR" },
      //   { text: "PWD", value: "PWD" }
      // ]
    };
  },
  computed: {
    getCashierDetails() {
      return this.$store.state.Auth.user;
    }
  },
  methods: {
    ...mapActions(["getTransactionById", "returnItems"]),
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async onSubmit() {
      //para sa pagpili ng transaction, gamit transactionNo
      this.errMsg = "";
      this.orderList = [];
      this.table.selected = [];
      this.toRefund = {};
      this.customer = {};
      const id = this.id;
      const res = await this.getTransactionById(this.id);
      //console.log(res);
      if (res.data.success == false) {
        return;
      }
      this.tableItems(res.data.trans.list_of_orders);

      if (res.data.trans.isDiscounted == true) {
        this.isDiscount = true;
        this.customer.id_no = res.data.trans.customer._id;
        this.customer.full_name = res.data.trans.customer.full_name;
        this.customer.custType = res.data.trans.customer.type;

        this.VATSales = this.convertToPeso(res.data.trans.VATSales);
        this.VAT = this.convertToPeso(res.data.trans.VAT);
        this.vatExempt = this.convertToPeso(res.data.trans.VatExempt);
        this.discount = this.convertToPeso(res.data.trans.discount);
        this.totalDue = this.convertToPeso(res.data.trans.total_amount);
        return;
      }
      this.isDiscount = false;
      this.VATSales = this.convertToPeso(res.data.trans.VATSales);
      this.VAT = this.convertToPeso(res.data.trans.VAT);
      this.vatExempt = this.convertToPeso(res.data.trans.VatExempt);
      this.discount = this.convertToPeso(res.data.trans.discount);
      this.totalDue = this.convertToPeso(res.data.trans.total_amount);
    },
    tableItems(item) {
      //pang fill ng items sa table
      item.forEach(data => {
        //console.log(data);
        this.orderList.push({
          prodId: data.prodId._id,
          productName: data.prodId.product_name,
          categoryName: data.prodId.category.category_name,
          categoryId: data.prodId.category._id,
          SRP: this.convertToPeso(Number(data.prodId.SRP.replace(/\,/g, ""))),
          quantity: data.quantity,
          total: this.convertToPeso(data.total),
          isVoid: data.isVoid ? "Yes" : "No",
          _rowVariant: data.isVoid ? "danger" : "none"
        });
      });
    },
    onRowSelected(items, index, $event) {
      this.errMsg = "";
      let selectedItem = [];

      let total = 0;
      this.table.selected.forEach(data => {
        total += Number(data.total.replace(/\₱|,/g, ""));
      });
      if (this.isDiscount == true) {
        let vatExempt = (total / 1.12) * 1;
        let VAT = total - vatExempt;
        let seniorDiscount = vatExempt * 0.2;
        let refundTotal = vatExempt - seniorDiscount;
        this.refundTotal = this.convertToPeso(refundTotal);

        return;
      }

      this.refundTotal = this.convertToPeso(total);
    },
    //para sa checkbox sa table
    async checkboxSelected(value, index, item) {
      if (value == true) {
        this.table.selected.push(item);
        this.onRowSelected(item);

        //console.log(this.table.selected);
        return;
      }
      if (value == false) {
        var index = this.table.selected.findIndex(function(o) {
          return o.prodId === item.prodId;
        });
        if (index !== -1) this.table.selected.splice(index, 1);
        this.onRowSelected();
        //console.log(this.table.selected);
      }
    },
    checkifDisabled(index, item) {
      //pang disable ng checkbox pag naka void na
      if (item.isVoid == "Yes") {
        return true;
      }
    },

    convertToPeso(amount) {
      const Peso = amount.toLocaleString("en-PH", {
        style: "currency",
        currency: "Php"
      });
      return Peso;
    },
    idInput() {
      if (this.id == "") {
        this.orderList = [];
        this.isDiscount = false;
        this.customer.id_no = "";
        this.customer.full_name = "";
        this.customer.custType = "";
        this.VATSales = this.convertToPeso(0);
        this.VAT = this.convertToPeso(0);
        this.vatExempt = this.convertToPeso(0);
        this.discount = this.convertToPeso(0);
        this.totalDue = this.convertToPeso(0);
        this.errMsg = "";
      }
    },
    async refundBtn() {
      this.toRefund = {};
      const refundAmount = this.refundTotal;
      const cashier = this.getCashierDetails;
      if (refundAmount == "₱ 0.00") {
        this.errMsg = "No items selected.";
        return;
      }

      this.toRefund = {
        order_no: this.id,
        items: this.table.selected,
        refundTotal: Number(this.refundTotal.replace(/\₱|,/g, "")),
        isDiscount: this.isDiscount,
        customer: this.customer.id_no ? this.customer.id_no : "none"
      };
      await this.returnItems(this.toRefund);
      //console.log(this.toRefund);
    },
    onBlur(event) {
      this.$refs.observer.reset();
    }
  }
};
</script>

<style scoped>
.form-control {
  height: 30px;
}
.borderStyle {
  border: 1px solid #0000ff;
  border-radius: 10px 10px;
  padding-right: 0px;
  padding-left: 15px;
}
.customerNameLabel {
  max-width: 23.33333%;
  font-size: 14px;
}
.inputOrderList {
  height: 25px;
}
</style>
