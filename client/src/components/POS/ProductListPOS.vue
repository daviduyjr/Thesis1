<template>
  <section>
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-6">
            <div class="form-group">
              <small class="text-muted">Filter</small>
              <b-input-group size="sm">
                <b-form-input
                  v-model="table.filter"
                  type="search"
                  id="filter-input"
                  placeholder="Search products."
                >
                </b-form-input>
              </b-input-group>
            </div>
          </div>
          <div class="col-6">
            <div class="form-group">
              <small class="text-muted">Category</small>
              <b-form-select
                id="category"
                v-model="filters.selectCatName"
                :options="options"
                @change="selectCat"
                size="sm"
              >
              </b-form-select>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 table-sm" style="height: 320px;">
        <b-table
          sticky-header
          :items="products"
          :fields="table.fields"
          :busy="table.isBusy"
          :filter="table.filter"
          :per-page="table.perPage"
          :current-page="table.currentPage"
          head-variant="dark"
          bordered
          small
          foot-clone
          show-empty
          empty-text="No data to available."
        >
          <template #cell(actions)="row">
            <b-button
              size="sm"
              @click="addToOrder(row.item, row.index, $event.target)"
              class="btn-info btn-block"
              px-0
              v-b-tooltip.hover
              title="Add"
            >
              <b-icon icon="cart-plus"></b-icon>
            </b-button>
          </template>
          <template v-slot:empty="scope">
            <h3 class="text-center">{{ scope.emptyText }}</h3>
          </template>
        </b-table>
      </div>
      <div class="col-12">
        <div class="row perPagePagiGroup">
          <div class="col-6 ">
            <div class="form-group ">
              <small class="text-muted">Per Page</small>
              <b-form-select
                id="per-page-select"
                v-model="table.perPage"
                :options="table.pageOptions"
                size="md"
                class="perPage"
              ></b-form-select>
            </div>
          </div>
          <b-col cols="6" class="perPageSelect">
            <b-pagination
              v-model="table.currentPage"
              :total-rows="rows"
              :per-page="table.perPage"
            >
            </b-pagination>
          </b-col>
        </div>
      </div>
    </div>

    <b-modal
      hide-footer
      id="quantityModal"
      title="QUANTITY"
      @hide="reseteditDistModal"
      ref="quantityModal"
      :header-bg-variant="modal.headerBgVariant"
      :header-text-variant="modal.headerTextVariant"
      size="sm"
    >
      <div class="row">
        <div class="col-12">
          <ValidationObserver v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)">
              <b-form-group
                id="stocksLbl"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="9"
                label="Stocks"
                label-for="stocks"
              >
                <b-form-input
                  v-model="quantityModal.stocks"
                  size="sm"
                  id="stocks"
                  disabled
                ></b-form-input>
              </b-form-group>
              <ValidationProvider
                name="Quantity"
                rules="quantityCheck|required|numeric"
                v-slot="quantityValidation"
              >
                <b-form-group
                  id="quantityLbl"
                  label-cols-sm="4"
                  label-cols-lg="3"
                  content-cols-sm
                  content-cols-lg="9"
                  label="Quantity"
                  label-for="quantity"
                >
                  <b-form-input
                    name="quantity"
                    size="sm"
                    id="quantity"
                    v-model="quantityModal.quantity"
                    :state="getValidationState(quantityValidation)"
                    autocomplete="off"
                  ></b-form-input>
                  <b-form-invalid-feedback id="prodNameFeedBack">
                    {{ quantityValidation.errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>
              <b-button block pill type="submit" variant="outline-primary"
                >Ok</b-button
              >
            </form>
          </ValidationObserver>
        </div>
      </div>
    </b-modal>
    <b-modal
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
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions } from "vuex";
import { extend } from "vee-validate";

extend("quantityCheck", {
  validate(value) {
    const stocks = parseInt(document.getElementById("stocks").value);
    const quantity = parseInt(value);
    return quantity <= stocks;
  },
  message: "{_field_} is invalid."
});
export default {
  name: "mainViewPOS",
  data() {
    return {
      products: [],
      order: {},
      modal: {
        headerBgVariant: "dark",
        headerTextVariant: "light"
      },
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
            sortable: true,
            thStyle: { width: "10%" }
          },
          {
            key: "product_name",
            label: "Products Name",
            sortable: true,
            thStyle: { width: "40%" }
          },
          {
            key: "category_name",
            label: "Category",
            sortable: false,
            thStyle: { width: "13%" }
          },
          {
            key: "SRP",
            label: "Price",
            sortable: false,
            thStyle: { width: "13%" }
          },
          {
            key: "stock_onhand",
            label: "Stock",
            sortable: false
          },
          { key: "actions", label: "Actions", thStyle: { width: "10%" } }
        ],
        sortDirection: "desc"
      },
      quantityModal: {
        stocks: "",
        quantity: ""
      }
    };
  },
  props: ["productsMain"],
  mounted() {
    this.getCategoryList();
    this.getProdList();
  },
  computed: {
    rows() {
      return this.products.length;
    },
    checkOrder() {
      return this.$store.state.POS.orderList;
    }
  },
  methods: {
    ...mapActions([
      "productList",
      "categoryList",
      "setOrderList",
      "productListPOS"
    ]),
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async getProdList() {
      const arr = [];
      this.table.isBusy = true;
      const prod = await this.productList();

      await prod.data.products.forEach(async data => {
        await arr.push({
          id: data.prodId._id,
          product_name: data.prodId.product_name,
          description: data.prodId.description,
          SRP: data.prodId.SRP,
          category_name: data.prodId.category.category_name,
          category_id: data.prodId.category._id,
          stock_onhand: data.stock_onhand,
          isActive: data.prodId.isActive
        });
      });

      this.products = arr;
      this.table.isBusy = false;
      return arr;
    },
    async getCategoryList() {
      const res = await this.categoryList();
      if (res.data.success == true) {
        this.categories = res.data.categories;
        res.data.categories.forEach(data => {
          this.options.push({
            value: data._id,
            text: data.category_name
          });
        });
      }
    },
    async selectCat(e) {
      try {
        const id = this.filters.selectCatName;
        const arr = [];

        if (id === null) {
          this.products = await this.getProdList();
          return;
        }
        let filteredItems = await this.getProdList();
        filteredItems = filteredItems.filter(product =>
          product.category_id.match(id)
        );
        this.products = filteredItems;
      } catch (err) {
        let json = '{"msg": "No records available!", "success": false }';
        let msg = JSON.parse(json);
        return msg;
      }
    },
    async addToOrder(item) {
      const list = await this.checkOrder;
      const found = list.some(el => el.id === item.id);
      if (found == true) {
        this.$refs["orderExistModal"].show();
        return;
      }
      const order = {
        id: item.id,
        product_name: item.product_name,
        description: item.description,
        SRP: item.SRP,
        category_name: item.category_name,
        category_id: item.category_id,
        stock_onhand: item.stock_onhand,
        isActive: item.isActive
      };
      this.order = order;

      this.$refs["quantityModal"].show();
      this.quantityModal.stocks = item.stock_onhand;
    },
    onSubmit() {
      const quantity = parseInt(document.getElementById("quantity").value);
      Object.assign(this.order, { quantity: quantity });
      const addOrder = this.order;
      this.setOrderList(addOrder);
      this.quantityModal.quantity = "";
      this.$refs["quantityModal"].hide();
      this.$emit("clicked", addOrder);
    },
    reseteditDistModal() {}
  }
};
</script>

<style scoped>
.card-title {
  font-size: 19px;
}
.productList {
  height: 350px;
}
.perPageSelect {
  padding-top: 24px;
}
.perPagePagiGroup {
  margin-top: -10px;
  margin-bottom: -17px;
}
.cardProdList {
  padding-top: 0px !important;
}
.btnAdd {
  margin-left: 8px;
}
.cardBody {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
