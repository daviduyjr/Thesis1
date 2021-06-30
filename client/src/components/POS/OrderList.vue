<template>
  <section>
    <div class="wrapper">
      <div class="card fixed-wrapper">
        <div class="card-header py-3">
          <div class="row">
            <div class="col-5 pl-0">
              <h2 class="orderNo float-left pt-1">Order No. {{ orderNo }}</h2>
            </div>
            <div class="col-7">
              <h2 class="card-title float-left ">
                POS
              </h2>
            </div>
          </div>
        </div>
        <div class="card-body pt-3 pb-1">
          <div class="row">
            <div class="col-12 mb-2">
              <div class="row">
                <div class="col-3">
                  <small class="text-muted">Search Product</small>
                  <v-select
                    label="prodName"
                    :options="selectProduct"
                    :value="$store.myValue"
                    @input="prodSelected"
                    class="style-chooser"
                    v-model="select2"
                  ></v-select>
                </div>
                <div class="col-3">
                  <div class="form-group">
                    <small class="text-muted">Category</small>
                    <b-form-select
                      id="category"
                      v-model="filterByCategory"
                      :options="categoryOptions"
                      @change="selectCat"
                      size="sm"
                    >
                    </b-form-select>
                  </div>
                </div>
                <div class="col-3 pt-3">
                  <b-button
                    @click="$bvModal.show('allProduct')"
                    pill
                    variant="outline-primary"
                    size="lg"
                  >
                    All Products</b-button
                  >
                </div>
              </div>
            </div>

            <div class="col-lg-12 col-sm-12 pl-0" style="height: 310px;">
              <div class="row">
                <div class="col-8">
                  <b-table
                    sticky-header
                    :items="orders"
                    :fields="table.fields"
                    :busy="table.isBusy"
                    :filter="table.filter"
                    head-variant="dark"
                    small
                    bordered
                    foot-clone
                    show-empty
                    empty-text="No transaction."
                    responsive
                  >
                    <template #cell(actions)="row">
                      <div class="row">
                        <div class="col-12 col-md-6 pr-0">
                          <b-button
                            size="sm"
                            @click="edit(row.item, row.index, $event.target)"
                            class="btn-success btn-block"
                            v-b-tooltip.hover
                            title="Edit"
                          >
                            <b-icon icon="pencil-square"></b-icon>
                          </b-button>
                        </div>
                        <div class="col-12 col-md-6 pl-1">
                          <b-button
                            size="sm"
                            @click="
                              voidItem(row.item, row.index, $event.target)
                            "
                            class="btn-success btn-block  "
                            v-b-tooltip.hover
                            title="Delete"
                          >
                            <b-icon icon="trash"></b-icon>
                          </b-button>
                        </div>
                      </div>
                    </template>
                    <template v-slot:empty="scope">
                      <h3 class="text-center">{{ scope.emptyText }}</h3>
                    </template>
                  </b-table>
                </div>
                <div class="col-4">
                  <div class="row">
                    <div v-if="this.isDiscount" class="row mx-1 borderStyle">
                      <small class="">Discount</small>
                      <div class="col-12 px-0" v-if="this.customer.id_no">
                        <div class="row">
                          <div class="col-4 pr-0">
                            <div class="form-group-row">
                              <label for="" class="col-4 px-0 customerNameLabel"
                                >ID:</label
                              >
                              <strong class="">{{
                                this.customer.id_no
                              }}</strong>
                            </div>
                          </div>
                          <div class="col-8 pr-0">
                            <div class="form-group-row">
                              <label for="" class="col-5 px-0 customerNameLabel"
                                >Name:</label
                              >
                              <strong class="">{{
                                this.customer.full_name
                              }}</strong>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-4">
                            <div class="form-group-row">
                              <small for="" class="col-5 px-0">Type:</small>
                              <strong class="">{{
                                this.customer.custType
                              }}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-12" v-if="this.customer.id_no">
                        <div class="form-inline mb-1 float-right">
                          <b-button
                            pill
                            @click="changeCustomer"
                            variant="outline-primary"
                            size="sm"
                          >
                            Change</b-button
                          >
                          <b-button
                            @click="cancelDiscount"
                            class="ml-1"
                            pill
                            variant="outline-danger"
                            size="sm"
                          >
                            Cancel</b-button
                          >
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

            <div class="col-12 mt-3 mb-3" style="text-align: right;">
              <!-- <div class="row" style="text-align: right;"> -->
              <span>
                <div class="inline">
                  <b-button
                    @click="$bvModal.show('returnModal')"
                    pill
                    variant="outline-primary"
                    size="lg"
                  >
                    Refund</b-button
                  >
                </div>
                <div class="inline">
                  <b-button
                    @click="discountBtn"
                    pill
                    variant="outline-primary"
                    size="lg"
                  >
                    SC/PWD Discount</b-button
                  >
                </div>

                <div class="inline">
                  <b-button
                    @click="checkout"
                    pill
                    variant="outline-primary"
                    size="lg"
                  >
                    Checkout</b-button
                  >
                </div>
              </span>
              <!-- </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      hide-footer
      id="prodOutLook"
      title="Product OutLook"
      ref="prodOutLookModal"
      :header-bg-variant="modal.headerBgVariant"
      :header-text-variant="modal.headerTextVariant"
      size="md"
      :no-close-on-backdrop="modal.closeOnBackdrop"
      @hide="prodOutlookHide"
    >
      <ProductOutLook :product="this.selectedProduct" />
    </b-modal>
    <b-modal
      hide-footer
      id="allProduct"
      title="Products"
      ref="allProductModal"
      header-bg-variant="dark"
      :header-text-variant="modal.headerTextVariant"
      size="lg"
      :no-close-on-backdrop="modal.closeOnBackdrop"
      @hide="prodOutlookHide"
    >
      <ProductListPOS />
    </b-modal>
    <!-- modal para sa warning -->
    <b-modal
      @hide="prodOutlookHide"
      hide-footer
      id="orderExist"
      title="Warning!"
      ref="orderExistModal"
      header-bg-variant="danger"
      :header-text-variant="modal.headerTextVariant"
      size="sm"
    >
      <div class="col-12" style="font-size:20px">
        <label>Item already in the list</label>
        <b-icon-exclamation-triangle-fill
          variant="danger"
          animation="fade"
        ></b-icon-exclamation-triangle-fill>
      </div>
    </b-modal>
    <b-modal
      hide-footer
      id="emptyOrder"
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
      title="Payment"
      ref="paymentModal"
      :header-bg-variant="modal.headerBgVariant"
      :header-text-variant="modal.headerTextVariant"
      :no-close-on-backdrop="modal.closeOnBackdrop"
      size="sm"
    >
      <PaymentModal
        @paymentSuccess="paymentSuccess"
        v-bind:allData="this.allData"
      />
    </b-modal>
    <!-- para sa invoice -->
    <b-modal
      hide-footer
      id="invoice"
      title="Product OutLook"
      ref="invoice"
      size="sm"
    >
      <Invoice :invoiceReciept="this.invoiceReciept" />
      <!-- <Invoice2 /> -->
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
      <DiscountModal
        @cancelDiscountModal="cancelDiscountModal"
        @customerSelected="customerSelected"
      />
    </b-modal>
    <b-modal
      hide-footer
      id="voidModal"
      title="Void"
      ref="voidModal"
      :hide-header-close="modal.headerClose"
      :header-bg-variant="modal.headerBgVariant"
      :header-text-variant="modal.headerTextVariant"
      :no-close-on-backdrop="modal.closeOnBackdrop"
      size="sm"
    >
      <VoidReasonModal @cancelVoid="cancelVoid" @voidReason="voidReason" />
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
    <b-modal
      hide-footer
      id="returnModal"
      title="returnModal"
      ref="returnModalModal"
      :header-bg-variant="modal.headerBgVariant"
      :header-text-variant="modal.headerTextVariant"
      size="md"
      :no-close-on-backdrop="modal.closeOnBackdrop"
      @hide="prodOutlookHide"
    >
      <ReturnItem />
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
import ProductOutLook from "../POS/ProductOutLook";
import ProductListPOS from "@/components/POS/ProductListPOS.vue";
import Invoice from "../POS/Invoice";
import ReturnItem from "../POS/ReturnItem";

let $ = JQuery;
export default {
  directives: { money: VMoney },
  name: "orderList",
  components: {
    PaymentModal,
    DiscountModal,
    DiscountSecurity,
    VoidReasonModal,
    ProductOutLook,
    ProductListPOS,
    Invoice,
    ReturnItem
  },
  data() {
    return {
      formIsNotSaved: false,
      orderNo: "",
      orders: [],
      VATSales: "",
      vatExempt: "",
      VAT: "",
      discount: "",
      totalDue: "",
      adminId: "",
      void: false,
      isDiscount: false,
      toVoid: {},
      voidProducts: [],
      priceNoDiscount: {
        VATSales: "",
        VAT: "",
        totalDue: ""
      },
      priceWithDiscount: {
        vatExempt: "",
        discount: "",
        totalDue: ""
      },
      invoiceReciept: {},
      options: [{ value: "", text: "Select Category" }],
      filters: {
        selectCatName: ""
      },
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
      //para sa select2
      allData: [],
      select2: "",
      selectProduct: [],
      selectedProduct: {},
      //para sa category filter
      categoryOptions: [
        {
          value: null,
          text: "All items"
        }
      ],
      filterByCategory: ""
    };
  },
  props: ["toOrder", "productsMain"],
  mounted() {
    this.checkOrder;
  },
  watch: {
    checkOrder(val) {
      this.watchOrderList(val);
    }
    // orderNoState() {
    //   return this.$store.state.POS.orderNo;
    // }
  },
  computed: {
    rows() {
      return this.orders.length;
    },
    checkOrder() {
      return this.$store.state.POS.orderList;
    },
    getCashierDetails() {
      return this.$store.state.Auth.user;
    },
    orderNoState() {
      return this.$store.state.POS.orderNo;
    },
    productState() {
      return this.$store.state.POS.productList;
    }
  },
  mounted() {
    this.setOrderNo();
    this.watchOrderList(this.checkOrder);
    this.getProdName();
    this.getCategoryList();
  },
  methods: {
    ...mapActions([
      "productList",
      "categoryList",
      "removeItem",
      "customerList",
      "productListPOS"
    ]),
    async getProdName() {
      //   console.log("OrderList", this.productsMain);
      const arr = await this.getProducts(this.productsMain);
      return arr;
    },
    async getProducts(data) {
      const arr = [];
      this.selectProduct = [];
      data.forEach(data => {
        data.forEach(async prod => {
          await arr.push({
            prod_id: prod.prodId,
            prodName: prod.product.product_name,
            description: prod.product.description,
            SRP: prod.product.SRP,
            category_name: prod.product.category[0].category_name,
            category_id: prod.product.category[0]._id,
            stock_onhand: prod.stock_onhand,
            isActive: prod.product.isActive
          });
        });
      });
      this.selectProduct = arr;
      return arr;
    },
    async prodSelected(value) {
      if (value == null) {
        this.select2 = "";
        return;
      }
      const list = await this.checkOrder;
      const found = await list.some(el => el.id === value.prod_id);
      if (found == true) {
        this.$refs["orderExistModal"].show();
        return;
      }
      if (Number(value.stock_onhand) < 10) {
        this.modal.headerBgVariant = "danger";
        this.selectedProduct = value;

        this.$bvModal.show("prodOutLook");
        return;
      }
      this.modal.headerBgVariant = "dark";
      this.selectedProduct = value;

      this.$bvModal.show("prodOutLook");
    },
    async getCategoryList() {
      const res = await this.categoryList();
      if (res.data.success == true) {
        res.data.categories.forEach(data => {
          this.categoryOptions.push({
            value: data._id,
            text: data.category_name
          });
        });
      }
    },
    async selectCat(e) {
      try {
        const id = this.filterByCategory;
        if (id === null) {
          await this.getProdName();
          return;
        }
        let filteredItems = await this.getProdName();

        filteredItems = await filteredItems.filter(product => {
          return product.category_id.match(id);
        });
        this.selectProduct = filteredItems;
      } catch (err) {
        let json = '{"msg": "No records available!", "success": false }';
        let msg = JSON.parse(json);
        return msg;
      }
    },
    prodOutlookHide() {
      this.select2 = "";
      this.modal.headerBgVariant = "dark";
    },
    watchOrderList(val) {
      let subTotalist = 0;
      this.orders = [];

      val.forEach(async prod => {
        const SRP = Number(prod.SRP.replace(/\₱|,/g, ""));

        const totalComputation = SRP * prod.quantity;

        const total = totalComputation.toLocaleString("en-PH", {
          style: "currency",
          currency: "Php"
        });

        subTotalist += Number(total.replace(/\₱|,/g, ""));

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
      if (this.isDiscount == true) {
        this.calculate(subTotalist);
        this.discountComputation();
        return;
      } else {
        this.calculate(subTotalist);
      }
    },
    calculate(subTotal) {
      let withOutVAT = (subTotal / 1.12) * 1;

      let VAT = subTotal - withOutVAT;
      let subtotal = subTotal - VAT;
      let TotalAmount = subtotal + VAT;

      this.VATSales = this.convertToPeso(subtotal);
      this.VAT = this.convertToPeso(VAT);
      this.totalDue = this.convertToPeso(TotalAmount);

      this.priceNoDiscount.VATSales = this.convertToPeso(subtotal);
      this.priceNoDiscount.VAT = this.convertToPeso(VAT);
      this.priceNoDiscount.totalDue = this.convertToPeso(TotalAmount);
    },
    convertToPeso(amount) {
      const Peso = amount.toLocaleString("en-PH", {
        style: "currency",
        currency: "Php"
      });
      return Peso;
    },
    async setOrderNo() {
      const orderN = await this.orderNoState;

      this.orderNo = "0" + (Number(orderN) + 1);
    },
    async getCustomerList() {
      await this.customerList();
    },
    edit(item) {
      console.log("edit", item);
    },
    voidItem(item, index) {
      this.void = true;
      //this.isDiscount = false;
      this.toVoid = {
        index: index,
        item: item
      };
      this.$bvModal.show("securityModal");
    },
    voidReason(reason) {
      this.void = false;

      this.voidProducts.push({
        index: this.toVoid.index,
        item: this.toVoid.item,
        reason: reason.reason
      });
      this.$bvModal.hide("voidModal");
      this.removeItem(this.toVoid.index);
    },
    async checkout() {
      const orderList = await this.orders;
      const cashierId = await this.getCashierDetails;

      if (orderList.length == 0) {
        this.$refs["emptyOrderWarningModal"].show();
        return;
      }
      this.allData = [];
      await this.allData.push({
        orderNo: this.orderNo,
        orderList: orderList,
        VATSales: this.VATSales,
        VatExempt: this.vatExempt,
        VAT: this.VAT,
        discount: this.discount,
        totalDue: this.totalDue,
        cashierId: cashierId,
        adminId: this.adminId,
        customer: this.customer.id_no == "" ? "none" : this.customer,
        isDiscounted: this.customer.id_no == "" ? false : true
      });

      this.$refs["paymentModal"].show();
    },
    //pag pili ng discount
    discountBtn() {
      this.$bvModal.show("securityModal");
    },
    // naka select na ng customer na eligible for discount
    async customerSelected(item) {
      this.isDiscount = true;
      this.customer.id_no = item._id;
      this.customer.full_name = item.full_name;
      this.customer.custType = item.type;

      this.discountComputation();

      this.$bvModal.hide("discountModal");
    },
    //pag palit ng customer
    changeCustomer() {
      this.$bvModal.show("securityModal");
    },
    cancelDiscount() {
      this.isDiscount = false;
      this.watchOrderList(this.checkOrder);
      this.vatExempt = 0;
      this.discount = 0;
      this.customer.id_no = "";
      this.customer.full_name = "";
      this.customer.custType = "";
    },
    discountComputation() {
      this.vatExempt = this.priceNoDiscount.VATSales;
      const vatExemptSales = Number(
        this.priceNoDiscount.VATSales.replace(/\₱|,/g, "")
      );
      const VAT = Number(this.priceNoDiscount.VAT.replace(/\₱|,/g, ""));
      const seniorDiscount = vatExemptSales * 0.2;
      const totalDueWithDisc = vatExemptSales - seniorDiscount;

      this.VAT = this.convertToPeso(0);
      this.VATSales = this.convertToPeso(0);
      this.discount = this.convertToPeso(seniorDiscount);
      this.totalDue = this.convertToPeso(totalDueWithDisc);
    },

    //para sa security ng discount
    async successAccess(userId) {
      await this.getCustomerList();
      this.modal.headerBgVariant = "dark";
      this.modal.headerTextVariant = "light";
      this.adminId = userId;
      this.$bvModal.hide("securityModal");

      if (this.void == true) {
        this.$refs["voidModal"].show();
        return;
      }
      this.$bvModal.show("discountModal");
    },
    accessDenied() {
      this.securityModal.title = "ERROR!";
      this.modal.headerBgVariant = "danger";
    },

    //para sa success transaction
    async paymentSuccess(data) {
      this.invoiceReciept = data;
      const res = await this.productListPOS();
      await this.getProducts(this.productState);
      await this.setOrderNo();
      this.isDiscount = false;
      this.customer.id_no = "";
      this.customer.full_name = "";
      this.customer.custType = "";
      this.$bvModal.hide("paymentModal");
      this.$bvModal.show("invoice");
    },

    //para sa pag hide ng mga modal
    cancelDiscountModal() {
      if (this.customer.id_no != null) {
        this.$bvModal.hide("discountModal");
      }
      this.$bvModal.hide("discountModal");
      this.isDiscount = false;
      this.void = false;
    },
    cancelVoid() {
      this.void = false;
      this.$bvModal.hide("voidModal");
    },
    cancelSecurity() {
      if (this.customer.id_no != null) {
        this.$bvModal.hide("discountModal");
      }
      this.void = false;

      this.$bvModal.hide("securityModal");
      this.securityModal.title = "Security";
      this.modal.headerBgVariant = "dark";
      this.modal.headerTextVariant = "light";
    },
    checkDiscountType() {}
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
.fixed-wrapper {
  position: sticky;
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
  padding-right: 0px;
  padding-left: 15px;
}
.customerNameLabel {
  max-width: 23.33333%;
  font-size: 14px;
}
/* .cardBody {
  padding-left: 17px;
  padding-right: 17px;
} */
.style-chooser .vs__search::placeholder,
.style-chooser .vs__dropdown-toggle,
.style-chooser .vs__dropdown-menu {
  background: #dfe5fb;
  border: none;
  color: red;
  text-transform: uppercase;
  font-variant: small-caps;
}
.inline {
  display: inline-block;
  margin-right: 5px;
}
.b-table-sticky-header {
}
</style>
