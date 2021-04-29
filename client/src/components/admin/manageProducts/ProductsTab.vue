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
              <button class="btn btn-lg btn-success">
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
        <div class="col-4">
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
        <div class="col-md-4"></div>
        <div class="col-md-4 my-1">
          <b-form-group
            v-model="sortDirection"
            label="Filter On"
            description="Leave all unchecked to filter on all data"
            label-cols-sm="3"
            label-align-md="center"
            label-size="md"
            class="mb-0"
            v-slot="{ ariaDescribedby }"
          >
            <b-form-checkbox-group
              class="mt-1"
              v-model="filterOn"
              :aria-describedby="ariaDescribedby"
            >
              <b-form-checkbox value="product_name"
                >Product Name</b-form-checkbox
              >
              <b-form-checkbox value="description">Description</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </div>
        <div class="col-12">
          <b-table
            class="table mb-2"
            :bordered="table.bordered"
            :hover="true"
            :items="table.products"
            :fields="table.fields"
            :head-variant="table.headVariant"
            :filter="table.filter"
            :filter-included-fields="filterOn"
            :fixed="table.fixed"
            :per-page="table.perPage"
            :current-page="table.currentPage"
            :busy.sync="table.isBusy"
            primary-key="_id"
            responsive="sm"
            sort-direction="desc"
            :sort-by.sync="table.sortBy"
            :sort-desc.sync="table.sortDesc"
            sort-icon-left
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
            <template #row-details="row">
              <b-card>
                <ul>
                  <li>
                    Product ID :
                    <strong>{{ row.item._id }}</strong>
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
                    Original Price :
                    <strong>{{ row.item.orig_price }}</strong>
                  </li>
                  <li>
                    SRP :
                    <strong>{{ row.item.SRP }}</strong>
                  </li>
                  <li>
                    RSP :
                    <strong>{{ row.item.reseller_price }}</strong>
                  </li>
                  <li>
                    Category :
                    <strong>{{ row.item.category.category_name }}</strong>
                  </li>
                  <li>
                    Net Weight :
                    <strong>{{ row.item.weight }}</strong>
                  </li>
                  <li>Quantity :</li>
                </ul>
              </b-card>
            </template>
          </b-table>
          <div class="col-12 errorTable" v-if="this.errorInList">
            <h3 class="mb-0">{{ this.errorInList }}</h3>
          </div>
        </div>
      </div>
    </b-overlay>
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions } from "vuex";

export default {
  name: "ProductsTab",
  data() {
    return {
      overlay: {
        show: false,
        variant: "transparent",
        opacity: 0.89,
        blur: "2px"
      },
      table: {
        filter: "",
        headVariant: "dark",
        sortDesc: true,
        bordered: true,
        fixed: false,
        perPage: 5,
        currentPage: 1,
        isBusy: false,
        sortBy: "_id",
        pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
        fields: [
          { key: "product_name", label: "Products Name", sortable: true },
          {
            key: "description",
            label: "Products Description",
            sortable: false
          },
          { key: "actions", label: "Actions", thStyle: { width: "20%" } }
        ],
        products: []
      },
      errorInList: "",
      sortDirection: "asc",
      filterOn: []
    };
  },
  mounted() {
    this.getProductList();
  },
  methods: {
    ...mapActions(["productList"]),

    async getProductList() {
      const result = await this.productList();
      if (result.success === false) {
        this.errorInList = result.msg;
      } else {
        this.table.products = result.data.products;
      }
      console.log(this.errorInList);
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
