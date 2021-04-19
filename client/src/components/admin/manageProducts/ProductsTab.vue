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
            <div class="col-md-3 mb-2">
              <button class="btn btn-lg btn-success">
                ADD PRODUCT
              </button>
            </div>
            <div class="col-md-6"></div>
          </div>
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
            :filter-included-fields="table.filterOn"
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
                    Products ID :
                    <strong>{{ row.item._id }}</strong>
                  </li>
                  <li>
                    Products Name :
                    <strong>{{ row.item.product_name }}</strong>
                  </li>
                  <li>
                    Products Description :
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
                </ul>
              </b-card>
            </template>
          </b-table>
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
      errorInList: ""
    };
  },
  mounted() {
    this.getProductList();
  },
  methods: {
    ...mapActions(["productList"]),

    async getProductList() {
      const result = await this.productList();

      if (result.data.products.length === 0) {
        this.errorInList = "No Data Available";
      } else {
        this.table.products = result.data.products;
      }
    }
  }
};
</script>

<style scoped></style>
