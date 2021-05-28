<template>
  <section>
    <div class="wrapper">
      <div class="card cardProdList" style="height: 542px;">
        <div class="card-body">
          <h2 class="card-title text-center">ORDER LIST</h2>
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
                <div class="col-6">adsf</div>
                <div class="col-6">
                  <div class="form-group row">
                    <label class="col-sm-6 col-form-label" for="subTotal"
                      >Sub-total</label
                    >
                    <div class="col-sm-6">
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
                    <label class="col-sm-6 col-form-label" for="VAT"
                      >VAT(12%)</label
                    >
                    <div class="col-sm-6">
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
                    <label class="col-sm-6 col-form-label" for="totalDue"
                      >Total Amount Due</label
                    >
                    <div class="col-sm-6">
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
            <div class="col-12 bottom">
              <div class="row">
                <div class="col-12">
                  <button
                    @click="pay"
                    class="btn btn-lg btn-success float-right"
                  >
                    PAY
                  </button>
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
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions } from "vuex";
import { VMoney } from "v-money";
export default {
  directives: { money: VMoney },
  name: "orderList",
  data() {
    return {
      formIsNotSaved: false,
      orders: [],
      subTotal: "",
      VAT: "",
      totalDue: "",
      options: [{ value: "", text: "Select Category" }],
      filters: {
        selectCatName: ""
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
      }
    };
  },
  props: ["toOrder"],
  mounted() {
    this.checkOrder;
  },
  watch: {
    checkOrder(val) {
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

      let VAT = subtotalList * 0.12;
      let subTotal = subtotalList - VAT;
      let TotalAmount = subTotal + VAT;

      console.log(subTotal);
      this.subTotal = this.convertToPeso(subTotal);
      this.VAT = this.convertToPeso(VAT);
      this.totalDue = this.convertToPeso(TotalAmount);
      // console.log((minusToSubtotal * 100).toFixed(2));
      // this.subTotal = subTotalFinal - minusToSubtotal;
      // this.VAT = Math.round(this.subTotal * (12 / 100));
      //  this.totalDue = this.subTotal + this.VAT;

      TotalAmount = this.convertToPeso(TotalAmount);
      console.log("totalAmout", TotalAmount);
    }
  },
  computed: {
    rows() {
      return this.orders.length;
    },
    checkOrder() {
      return this.$store.state.POS.orderList;
    }
  },

  methods: {
    ...mapActions(["productList", "categoryList", "removeItem"]),
    convertToPeso(amount) {
      const Peso = amount.toLocaleString("en-PH", {
        style: "currency",
        currency: "Php"
      });
      return Peso;
    },
    rowClass(item, type) {
      if (item && type === "row") {
        if (item.released === true) {
          return "text-success";
        } else {
          return "text-secondary";
        }
      } else {
        return null;
      }
    },

    removeOrder(item, index) {
      this.removeItem(index);
    },

    pay() {
      const orderList = this.orders;

      if (orderList.length == 0) {
        this.$refs["emptyOrderWarningModal"].show();
        return;
      }
      alert("may order");
      console.log(orderList);
    }
  }
};
</script>

<style scoped>
.card-title {
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
/* .card-body {
  padding-left: 5px;
  padding-right: 5px;
} */
</style>
