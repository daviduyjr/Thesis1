/* eslint-disable */
<template>
  <section class="Products">
    <b-overlay
      :variant="overlay.variant"
      :opacity="overlay.opacity"
      :blur="overlay.blur"
      :show="overlay.show"
      rounded="sm"
    >
      <div class="row" :aria-hidden="overlay.show ? 'true' : null">
        <div class="col-12">
          <div class="row">
            <div class="col-md-8 mb-2">
              <button class="btn btn-lg btn-success" @click="addProduct()">
                ADD PRODUCT
              </button>
            </div>

            <div class="col-md-4">
              <b-form-group
                label="Filter"
                label-for="filter-input"
                label-cols-sm="3"
                label-align-lg="right"
                label-size="lg"
                class="mb-0"
              >
                <b-input-group size="md">
                  <b-form-input
                    v-model="table.filter"
                    type="search"
                    id="filter-input"
                    placeholder="Type to search products."
                  >
                  </b-form-input>
                  <b-input-group-append>
                    <button
                      :disabled="!table.filter"
                      @click="table.filter = ''"
                      class="btn btn-dark"
                    >
                      Clear
                    </button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </div>
          </div>
        </div>
        <div class="col-3">
          <b-form-group
            label="Per page:"
            label-for="per-page-select"
            label-cols-sm="6"
            label-cols-md="4"
            label-cols-lg="3"
            label-align-sm="left"
            label-size="md"
            class="mb-2"
            style="font-size: 18px;"
          >
            <b-form-select
              id="per-page-select"
              v-model="table.perPage"
              :options="table.pageOptions"
              size="md"
              class="perPage"
            ></b-form-select>
          </b-form-group>
        </div>
        <!-- <div class="col-md-"></div> -->
        <div class="col-md-5 my-1"></div>
        <div class="col-4">
          <b-form-group
            label-for="category"
            label="Filter By Category"
            label-size="lg"
            label-cols-lg="4"
            label-align="center"
          >
            <b-form-select
              id="category"
              v-model="filters.selectCatName"
              :options="options"
              @change="selectCat"
            >
            </b-form-select>
          </b-form-group>
        </div>

        <div class="col-12">
          <b-table
            ref="table"
            class="table mb-2"
            :bordered="table.bordered"
            :hover="true"
            :items="products"
            :fields="table.fields"
            :head-variant="table.headVariant"
            :filter="table.filter"
            :filter-included-fields="table.filterOn"
            :fixed="table.fixed"
            :per-page="table.perPage"
            :current-page="table.currentPage"
            :busy.sync="table.isBusy"
            responsive="sm"
            sort-direction="desc"
            :sort-by.sync="table.sortBy"
            :sort-desc.sync="table.sortDesc"
            sort-icon-left
            empty-text="No data to available."
            show-empty
          >
            <template #cell(actions)="row">
              <b-button size="sm" @click="row.toggleDetails">
                {{ row.detailsShowing ? "Hide" : "Show" }} Details
              </b-button>
              <b-button
                size="sm"
                @click="edit(row.item, row.index, $event.target)"
                class="mr-1"
              >
                Edit
              </b-button>
            </template>
            <template v-slot:empty="scope">
              <h3 class="text-center">{{ scope.emptyText }}</h3>
            </template>
            <template #row-details="row">
              <b-card>
                <ul>
                  <li>
                    Product ID :
                    <strong>{{ row.item.id }}</strong>
                  </li>
                  <li>
                    Product Name :
                    <strong>{{ row.item.product_name }}</strong>
                  </li>
                  <li>
                    Product Description :
                    <strong>{{ row.item.description }}</strong>
                  </li>
                  <li>
                    Unit Price :
                    <strong>{{ row.item.unit_price }}</strong>
                  </li>
                  <li>
                    Markup Price :
                    <strong>{{ row.item.markup_price }}</strong>
                  </li>
                  <li>
                    SRP :
                    <strong>{{ row.item.SRP }}</strong>
                  </li>

                  <li>
                    Category :
                    <strong>{{ row.item.category_name }}</strong>
                  </li>

                  <li>
                    Stock Onhand :
                    <strong>{{ row.item.stock_onhand }}</strong>
                  </li>
                  <li>
                    Is Active :
                    <strong>{{ row.item.isActive }}</strong>
                  </li>
                </ul>
              </b-card>
            </template>
          </b-table>
          <!-- <div class="col-12 errorTable" v-if="this.errorInList">
            <h3 class="mb-0">{{ this.errorInList }}</h3>
          </div> -->
        </div>
        <div class="col-12">
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
    </b-overlay>
    <b-modal
      hide-footer
      :id="addProductModal.id"
      title="ADD PRODUCT"
      @hide="reseteditDistModal"
      ref="addProductModal"
      :header-bg-variant="modal.headerBgVariant"
      :header-text-variant="modal.headerTextVariant"
      size="md"
    >
      <AddProduct :categories="this.categories" @clicked="addProdSuccess" />
    </b-modal>
    <b-modal
      hide-footer
      :id="addProductModal.id"
      title="PRODUCT DETAILS"
      @hide="reseteditDistModal"
      ref="productDetailsModal"
      :header-bg-variant="modal.headerBgVariant"
      :header-text-variant="modal.headerTextVariant"
      size="md"
    >
      <ProductDetails
        :product="this.productDetails"
        @clicked="addProdSuccess"
      />
    </b-modal>
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
import AddProduct from "../manageProducts/ProductModal/AddProduct";
import ProductDetails from "../manageProducts/ProductModal/ProductDetails";

export default {
  name: "ProductsTab",
  components: {
    AddProduct,
    ProductDetails
  },
  data() {
    return {
      overlay: {
        show: false,
        variant: "transparent",
        opacity: 0.89,
        blur: "2px"
      },
      modal: {
        headerBgVariant: "dark",
        headerTextVariant: "light"
      },
      filters: {
        search: "",
        selectCatName: ""
      },
      table: {
        filter: "",
        secondFilter: "",
        headVariant: "dark",
        sortDesc: true,
        bordered: true,
        fixed: false,
        perPage: 5,
        currentPage: 1,
        isBusy: false,
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
            key: "category_name",
            label: "Category",
            sortable: false
          },
          { key: "actions", label: "Actions", thStyle: { width: "20%" } }
        ],
        filterOn: [],
        sortDirection: "desc"
      },
      errorInList: "",
      productDetails: [],
      products: [],
      categories: [],
      options: [{ value: "", text: "Searh Category" }],
      categorySelect: "",
      addProductModal: {
        id: "info-modal",
        title: "",
        content: {}
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
    listOfProducts() {
      return this.$store.state.productDetails.productList;
    }
  },
  methods: {
    ...mapActions(["productList", "categoryList"]),
    ...mapGetters(["productListGetter"]),
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

    async getProductList() {
      const result = await this.productList();
      if (result.success === false) {
        //this.errorInList = result.msg;
      } else {
        this.products = await this.prodList();
        return;
      }
    },
    addProduct() {
      this.$refs["addProductModal"].show();
    },
    addProdSuccess() {
      this.$refs["addProductModal"].hide();
      this.overlay.show = true;
      setTimeout(() => {
        this.getProductList();
        this.getProdDetails();
        this.$refs.table.refresh();
        this.$refs["productDetailsModal"].show();
        this.overlay.show = false;
        this.$toast.success("Successfully Saved.", {
          rtl: false,
          timeOut: 2000,
          closeable: true
        });
      }, 2000);
    },
    getProdDetails() {
      const newP = this.$store.state.productDetails.newProduct;
      const prod = {
        productId: newP.prodId._id,
        productName: newP.prodId.product_name,
        description: newP.prodId.description,
        category: newP.prodId.category.category_name,
        unit_price: newP.prodId.unit_price,
        markup_price: newP.prodId.markup_price,
        srp: newP.prodId.SRP,
        stock_onhand: newP.stock_onhand,
        isActive: newP.prodId.isActive
      };
      this.productDetails = prod;
    },
    edit(item, index) {
      console.log("item", item.id);
      console.log("index", index);
    },
    reseteditDistModal() {
      this.addProductModal.title = "";
      this.addProductModal.content = "";
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

    async prodList(product) {
      const arr = [];
      this.listOfProducts.forEach(async prod => {
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
    }
  }
};
</script>

<style scoped>
.errorTable {
  text-align: center;
  border: 1px solid;
  border-radius: 5px;
  background-color: snow;
}
.errorTable {
  /* width: 50px;
  height: 50px; */
  -webkit-animation: NAME-YOUR-ANIMATION 1s infinite; /* Safari 4+ */
  -moz-animation: NAME-YOUR-ANIMATION 1s infinite; /* Fx 5+ */
  -o-animation: NAME-YOUR-ANIMATION 1s infinite; /* Opera 12+ */
  animation: NAME-YOUR-ANIMATION 1s infinite; /* IE 10+, Fx 29+ */
}

@-webkit-keyframes NAME-YOUR-ANIMATION {
  0%,
  49% {
    background-color: rgb(255, 255, 255);
    border: 3px solid #e50000;
  }
  50%,
  100% {
    background-color: #e50000;
    border: 3px solid rgb(117, 209, 63);
  }
}
</style>
