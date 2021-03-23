<template>
  <section class="Categories">
    <b-overlay
      :variant="variant"
      :opacity="opacity"
      :blur="blur"
      :show="show"
      rounded="sm"
    >
      <div class="row" :aria-hidden="show ? 'true' : null">
        <div class="col-md-6">
          <validation-observer ref="observer" v-slot="{ handleSubmit }">
            <validation-provider
              name="Category Name"
              :rules="{ required: true, min: 5 }"
              v-slot="catnameValidation"
            >
              <form @submit.stop.prevent="handleSubmit(onSubmit)">
                <div class="form-group">
                  <div class="input-group">
                    <b-form-input
                      id="categoryName"
                      name="categoryName"
                      type="text"
                      class="form-control"
                      placeholder="Add Category"
                      v-model="categoryName"
                      @focus="onFocus($event)"
                      @blur.native="onBlur($event)"
                      :state="getValidationState(catnameValidation)"
                      aria-describedby="input-1-live-feedback"
                      autocomplete="off"
                    ></b-form-input>

                    <b-input-group-append>
                      <button type="submit" class="btn btn-primary btn-lg">
                        Save
                      </button>
                    </b-input-group-append>
                    <b-form-invalid-feedback id="input-1-live-feedback">{{
                      catnameValidation.errors[0]
                    }}</b-form-invalid-feedback>
                  </div>
                </div>
              </form>
            </validation-provider>
          </validation-observer>
        </div>
        <div class="col-md-2"></div>

        <div class="col-md-4">
          <b-form-group
            label="Filter"
            label-for="filter-input"
            label-cols-sm="3"
            label-align-lg="center"
            label-size="lg"
            class="mb-0"
          >
            <b-input-group size="md">
              <b-form-input
                v-model="filter"
                type="search"
                id="filterInput"
                placeholder="Type to Search Category"
              ></b-form-input>

              <b-input-group-append>
                <button
                  :disabled="!filter"
                  @click="filter = ''"
                  class="btn btn-dark"
                >
                  Clear
                </button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </div>
        <b-col sm="5" md="6" class="my-1">
          <!-- <b-form-group
          label="Per page"
          label-for="per-page-select"
          label-cols-sm="6"
          label-cols-md="4"
          label-cols-lg="3"
          label-align-sm="left"
          label-size="md"
          class="mb-0 perPageLabel"
          style="font-size: 18px;"
        > -->
          <label class="perPageLabel">Per page:</label>
          <b-form-select
            id="per-page-select"
            v-model="perPage"
            :options="pageOptions"
            size="md"
            class="perPage"
          ></b-form-select>
          <!-- </b-form-group> -->
        </b-col>
        <div class="col-md-2"></div>
        <div class="col-md-4">
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
              v-model="filterOn"
              :aria-describedby="ariaDescribedby"
              class="mt-1"
            >
              <b-form-checkbox value="category_name">Name</b-form-checkbox>
              <b-form-checkbox value="isActive">Active</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </div>
      </div>

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
            :filter-included-fields="filterOn"
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
              <!-- <b-button size="sm" @click="row.toggleDetails">
                      {{ row.detailsShowing ? "Hide" : "Show" }} Details
                    </b-button> -->
              <b-button
                size="sm"
                @click="edit(row.item, row.index, $event.target)"
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
      <div>
        <b-modal
          hide-footer
          :id="catInfoModal.id"
          title="EDIT CATEGORIES"
          @hide="resetInfoModal"
          ref="modal-catNameEdit"
        >
          <validation-observer ref="observer" v-slot="{ handleSubmit }">
            <form
              class="editCatForm"
              @submit.stop.prevent="handleSubmit(onEditSubmit)"
            >
              <validation-provider
                name="Category Name"
                :rules="{ required: true, min: 5 }"
                v-slot="catToEditValidation"
              >
                <b-form-group label="Category Name" label-for="name-input">
                  <b-form-input
                    id="categoryNameToEdit"
                    v-model="categoryNameToEdit"
                    :state="getValidationState(catToEditValidation)"
                    aria-describedby="input-1-live-feedback"
                    autocomplete="off"
                  ></b-form-input>
                  <b-form-invalid-feedback id="input-1-live-feedback">{{
                    catToEditValidation.errors[0]
                  }}</b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
              <div class="input-group switch">
                <b-form-checkbox
                  id="isActiveSwitch"
                  class="editFormInput mb-2"
                  v-model="isActive"
                  name="check-button"
                  switch
                  @change="switchChange"
                >
                  Is Active : <b>{{ isActive ? "Yes" : "No" }}</b>
                </b-form-checkbox>
              </div>
              <button type="submit" class="btn btn-primary btn-lg">
                Save
              </button>
            </form>
          </validation-observer>
        </b-modal>
      </div>
      <div>
        <b-modal
          hide-footer
          @hide="onCancel()"
          ref="confirmation"
          :title="this.confirmationModal.title"
        >
          <p class="my-4">
            {{
              this.method === "Add"
                ? `Are you sure you want to add ${this.categoryName}? `
                : `Are you sure you want to save this?`
            }}
          </p>
          <div class="alert alert-danger" v-if="errMsg">
            {{ errMsg }}
          </div>
          <b-button
            class="mt-3"
            variant="outline-success"
            block
            :disabled="show"
            @click="submitAddFinal()"
            >Yes</b-button
          >
          <b-button
            class="mt-3"
            variant="outline-danger"
            @click="onCancel()"
            block
            >No</b-button
          >
        </b-modal>
      </div>
      <template #overlay>
        <div class="text-center">
          <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
          <p id="cancel-label">Please wait...</p>
        </div>
      </template>
    </b-overlay>
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters, mapState } from "vuex";
import store from "@/store";
import axios from "axios";
import router from "../../../router";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "CategoriesComp",

  data() {
    return {
      show: false,
      variant: "transparent",
      opacity: 0.89,
      blur: "2px",
      filter: "",
      headVariant: "dark",
      perPage: 5,
      currentPage: 1,
      isBusy: false,
      sortBy: "name",
      sortDesc: true,
      bordered: true,
      fixed: false,
      id: "",
      categoryName: "",
      categoryNameToEdit: "",
      categories: [],
      fields: [
        { key: "category_name", sortable: true, label: "Category" },
        {
          key: "isActive",
          sortable: false,
          label: "Is Active",
          thStyle: { width: "18%" }
        },
        { key: "actions", label: "Actions", thStyle: { width: "20%" } }
      ],
      catInfoModal: {
        id: "info-modal",
        title: "",
        content: {}
      },
      confirmationModal: {
        title: ""
      },
      method: "",
      errMsg: "",
      counter: 0,
      isLoading: false,
      fullPage: false,
      loader: "spinner",
      canCancel: false,
      submitStatus: null,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      filterOn: [],
      sortDirection: "asc",
      checkIfActive: false,
      isActive: ""
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
    ...mapActions(["categoryList", "addCategory", "editCategory"]),

    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },

    async getCatList() {
      //pang kuha ng list ng category
      this.isBusy = true;
      axios
        .get("http://localhost:5000/api/admin/categoryList")
        .then(({ data }) => {
          this.isBusy = false;
          if (data.categories.lenght === 0) {
            alert("no data");
          }
          this.categories = data.categories;
        })
        .catch(err => {
          console.log("may error");
        });
    },
    // start ng pang add and edit
    resetForm() {
      //pang reset ng form after mag add and edit
      this.categoryNameToEdit = null;
      if (this.method === "Add") {
        this.categoryName = null;
        this.$refs["confirmation"].hide();
      } else {
        this.categoryNameToEdit = null;
        this.$refs["confirmation"].hide();
        this.$refs["modal-catNameEdit"].hide();
      }
      this.method = null;
    },

    onSubmit() {
      // para mapalabas lang yung modal for confirmation pag nag add
      this.confirmationModal.title = "Add Category";
      this.method = "Add";
      this.$refs["confirmation"].show();
    },
    onCancel() {
      console.log("User cancelled the loader.");
    },
    async submitAddFinal() {
      this.show = true;
      const toAdd = this.categoryName;
      if (this.method === "Add") {
        //eto na yung pang add mismo ng category
        await this.addCategory(toAdd).then(result => {
          debugger;
          if (result[0].data.success === true) {
            this.isLoading = true;
            this.$refs["confirmation"].hide();
            setTimeout(() => {
              this.isLoading = false;
              this.resetForm();
              this.getCatList();
              this.show = false;
              this.$refs.observer.reset();
              this.$toast.success("Successfully Added.", {
                rtl: false,
                timeOut: 3000,
                closeable: true
              });
            }, 2000);
          }

          if (result[0].data.success === false) {
            this.isLoading = false;
            this.errMsg = result[0].data.msg;
          }
        });
      } else {
        //eto na yung pang edit mismo ng category

        const toEdit = {
          id: this.id,
          catName: this.categoryNameToEdit,
          catStatus: this.isActive ? "Yes" : "No"
        };
        await this.editCategory(toEdit).then(res => {
          if (res.data.success === true) {
            this.isLoading = true;
            this.$refs["confirmation"].hide();

            setTimeout(() => {
              this.isLoading = false;
              this.resetForm();
              this.getCatList();
              this.show = false;
              this.$toast.success("Successfully Edited.", {
                rtl: false,
                timeOut: 2000,
                closeable: true
              });
            }, 2000);
          }
          if (res.data.success === false) {
            this.isLoading = false;
            this.errMsg = res.data.err;
          }
        });
      }
    },

    // end ng pang add and edit

    switchChange(e) {
      //para sa switch ng isActive sa edit category
      this.$nextTick(() => {
        if (e === false) {
          this.checkIfActive = true;
        } else {
          this.checkIfActive = false;
        }
      });
    },

    async edit(item, index, button) {
      // START -lalabas yung modal para makapag edit ng category
      this.categoryNameToEdit = item.category_name;
      this.id = item._id;
      this.isActive = item.isActive;
      if (this.isActive === "Yes") {
        this.isActive = true;
        this.checkIfActive = false;
      } else {
        this.isActive = false;
        this.checkIfActive = true;
      }
      // END -lalabas yung modal para makapag edit ng category
      this.$root.$emit("bv::show::modal", this.catInfoModal.id, button);
    },
    async onEditSubmit() {
      // para mapalabas lang yung modal for confirmation pag nag edit
      this.confirmationModal.title = "Edit Category";
      this.method = "Edit";
      this.$refs["confirmation"].show();
    },

    async resetInfoModal() {
      this.catInfoModal.title = "";
      this.catInfoModal.content = "";
    },

    async onCancel() {
      this.errMsg = "";
      this.resetForm();
    },

    onBlur(event) {
      this.$refs.observer.reset();
    },

    onFocus(event) {
      // console.log("onFocus");
    }
  }
};
</script>

<style scoped>
.card-title {
  font-size: 27px;
}
.btn-sm {
  padding: 0.5rem 4.81rem;
}
.perPage {
  max-width: 37%;
  margin-bottom: 5px;
}
.perPageLabel {
  font-size: 15px;
  line-height: 1;
  vertical-align: middle;
  margin-right: 14px;
}
</style>
