<template>
  <section class="register">
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center">Categories</h2>
            <validation-observer ref="observer" v-slot="{ handleSubmit }">
              <form @submit.stop.prevent="handleSubmit(onSubmit)">
                <validation-provider
                  name="Category"
                  :rules="{ required: true, min: 5 }"
                  v-slot="categoryValidation"
                >
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <!-- <span class="input-group-text">
                          <i
                            class="mdi mdi-account-outline"
                            style="font-size: 1.4rem;"
                          ></i>
                        </span> -->
                          </div>
                          <b-form-input
                            id="username"
                            name="username"
                            type="text"
                            class="form-control"
                            placeholder="Category"
                            v-model="categoryName"
                            :state="getValidationState(categoryValidation)"
                            aria-describedby="input-1-live-feedback"
                            autocomplete="off"
                          ></b-form-input>
                          <b-form-invalid-feedback id="input-1-live-feedback">{{
                            categoryValidation.errors[0]
                          }}</b-form-invalid-feedback>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <button type="submit" class="btn btn-primary btn-lg">
                        Save
                      </button>
                    </div>
                    <div class="col-md-3">
                      <b-form-input
                        v-model="filter"
                        type="search"
                        id="filterInput"
                        placeholder="Type to Search"
                      ></b-form-input>
                    </div>
                  </div>
                </validation-provider>
              </form>
            </validation-observer>
            <b-row>
              <b-col>
                <b-table
                  class="table mb-2"
                  :bordered="bordered"
                  :hover="true"
                  :items="categories"
                  :fields="fields"
                  :head-variant="headVariant"
                  :filter="filter"
                  :fixed="fixed"
                  :per-page="perPage"
                  :current-page="currentPage"
                  :busy.sync="isBusy"
                  primary-key="_id"
                  responsive="sm"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                >
                  <template #cell(actions)="row">
                    <b-button size="sm" @click="row.toggleDetails">
                      {{ row.detailsShowing ? "Hide" : "Show" }} Details
                    </b-button>
                    <b-button
                      size="sm"
                      @click="info(row.item, row.index, $event.target)"
                      class="mr-1"
                    >
                      Edit
                    </b-button>
                  </template>
                </b-table>
              </b-col>
            </b-row>
            <b-row md="3">
              <b-col cols="12">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rows"
                  :per-page="perPage"
                >
                </b-pagination>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
    </div>
    <b-row class="mb-3">
      <b-col md="3"> </b-col>
    </b-row>
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters, mapState } from "vuex";
import store from "@/store";
import { mask } from "vue-the-mask";
import axios from "axios";

export default {
  directives: { mask },
  name: "addCategoriesComp",
  data() {
    return {
      filter: "",
      headVariant: "dark",
      perPage: 3,
      currentPage: 1,
      isBusy: false,
      sortBy: "name",
      sortDesc: false,
      bordered: true,
      fixed: false,
      categoryName: "",
      categories: [],
      fields: [
        { key: "category_name", sortable: true, label: "Category" },
        { key: "actions", label: "Actions", thStyle: { width: "18%" } }
      ]
    };
  },
  computed: {
    rows() {
      return this.categories.length;
    }
  },
  mounted() {
    this.getCatList();
  },
  methods: {
    ...mapActions(["categoryList", "addCategory"]),
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },

    async getCatList() {
      this.isBusy = true;
      axios
        .get("http://localhost:5000/api/admin/categoryList")
        .then(({ data }) => {
          this.isBusy = false;
          if (data.categories.lenght === 0) {
            alert("no data");
          }
          this.categories = data.categories;
          console.log(this.categories);
        })
        .catch(err => {
          console.log("may error");
        });
    },

    async onSubmit() {
      const catName = this.categoryName;
      this.addCategory(catName).then(result => {
        debugger;
        console.log(result);
        getCatList();
      });
    }
  }
};
</script>

<style scoped>
.card-title {
  font-size: 27px;
}
</style>
