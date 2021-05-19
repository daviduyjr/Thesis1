<template>
  <section>
    <div class="card">
      <div class="card-body">
        <h2 class="card-title text-center">PRODUCTS</h2>
        <div class="row">
          <div class="col-12">
            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label for="filter-input">Filter</label>
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="table.filter"
                      type="search"
                      id="filter-input"
                      placeholder="Search products."
                    >
                    </b-form-input>
                    <!-- <b-input-group-append>
                      <button
                        :disabled="!table.filter"
                        @click="table.filter = ''"
                        class="btn btn-dark btn-sm"
                      >
                        Clear
                      </button>
                    </b-input-group-append> -->
                  </b-input-group>
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="category">Category</label>
                  <b-form-select
                    id="category"
                    v-model="filters.selectCatName"
                    :options="options"
                    @change="selectCat"
                    size="sm"
                  >
                    <!-- <template #first>
                      <b-form-select-option :value="null">
                        -- Select a category --</b-form-select-option
                      >
                    </template> -->
                  </b-form-select>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12" style="height: 350px;">
            <b-table
              class="productList"
              sticky-header
              :items="products"
              :fields="table.fields"
              :busy="table.isBusy"
              :filter="table.filter"
              :per-page="table.perPage"
              :current-page="table.currentPage"
              :small="table.small"
              head-variant="dark"
              bordered
              responsive
              foot-clone
            >
              <template #cell(actions)="row">
                <b-button
                  size="sm"
                  @click="addToOrder(row.item, row.index, $event.target)"
                  class="mr-1"
                >
                  Add
                </b-button>
              </template>
            </b-table>
          </div>
          <div class="col-12 mt-2">
            <b-row md="3">
              <b-col cols="12">
                <b-pagination
                  v-model="table.currentPage"
                  :total-rows="rows"
                  :per-page="table.perPage"
                >
                </b-pagination>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions } from "vuex";
export default {
  name: "mainViewPOS",
  data() {
    return {
      products: [],
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
            thStyle: { width: "70%" }
          },
          { key: "actions", label: "Actions", thStyle: { width: "30%" } }
        ],
        sortDirection: "desc"
      }
    };
  },
  mounted() {
    this.getProductList();
    this.getCategoryList();
  },
  computed: {
    rows() {
      return this.products.length;
    },
    productListState() {
      return this.$store.state.productDetails.productList;
    }
  },
  methods: {
    ...mapActions(["productList", "categoryList"]),
    async getProductList() {
      this.table.isBusy = true;
      const result = await this.productList();
      if (result.success === false) {
        //this.errorInList = result.msg;
      } else {
        this.table.isBusy = false;
        this.products = await this.prodList();
        return;
      }
    },
    async prodList(product) {
      const arr = [];
      this.productListState.forEach(async prod => {
        await arr.push({
          id: prod.prodId._id,
          product_name: prod.prodId.product_name,
          description: prod.prodId.description,
          unit_price: prod.prodId.unit_price,
          SRP: prod.prodId.SRP,
          markup_price: prod.prodId.markup_price,
          category_name: prod.prodId.category.category_name,
          category_id: prod.prodId.category._id,
          stock_onhand: prod.stock_onhand,
          isActive: prod.prodId.isActive
        });
      });

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
          this.products = await this.prodList();
          return;
        }

        let filteredItems = await this.prodList();
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
    addToOrder(item) {
      console.log(item);
    }
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
</style>
