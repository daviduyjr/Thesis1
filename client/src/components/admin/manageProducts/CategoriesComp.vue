<template>
  <section class="Categories">
    <loading
      :active="isLoading"
      :is-full-page="fullPage"
      :loader="loader"
      :canCancel="canCancel"
    />
    <div class="row">
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
                <div></div>
              </div>
            </form>
          </validation-provider>
        </validation-observer>
      </div>
      <div class="col-md-2"></div>

      <div class="col-md-4">
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
              class="btn btn-warning"
            >
              Clear
            </button>
          </b-input-group-append>
        </b-input-group>
      </div>
      <b-col sm="5" md="6" class="my-1">
        <b-form-group
          label="Per page"
          label-for="per-page-select"
          label-cols-sm="6"
          label-cols-md="4"
          label-cols-lg="3"
          label-align-sm="left"
          label-size="sm"
          class="mb-0"
        >
          <b-form-select
            id="per-page-select"
            v-model="perPage"
            :options="pageOptions"
            size="md"
            class="perPage"
          ></b-form-select>
        </b-form-group>
      </b-col>
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
          <validation-provider
            name="Category Name"
            :rules="{ required: true, min: 5 }"
            v-slot="catToEditValidation"
          >
            <form
              class="editCatForm"
              @submit.stop.prevent="handleSubmit(onEditSubmit)"
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

              <button type="submit" class="btn btn-primary btn-lg">
                Save
              </button>
            </form>
          </validation-provider>
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
          <!-- Are you sure you want to {{ this.method }}
          {{
            this.method === "Edit" ? this.categoryNameToEdit : this.categoryName
          }}
          ? -->
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
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters, mapState } from "vuex";
import store from "@/store";
import axios from "axios";
import router from "../../../router";
// import { validationMixin } from "vuelidate";
// import { required, minLength } from "vuelidate/lib/validators";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "CategoriesComp",

  data() {
    return {
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
      categoryname: "",
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
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }]
    };
  },
  // mixins: [validationMixin],
  components: {
    Loading
  },
  // validations: {
  //   categoryName: { required, minLength: minLength(3) }
  // },
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
    // start ng pang add
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
      // this.$nextTick(() => {
      //   this.$v.$reset();
      // });
    },

    onSubmit() {
      // this.$v.$touch();
      // if (this.$v.$anyError) {
      //   console.log(this.$v.$anyError);
      //   return;
      // }
      this.confirmationModal.title = "Add Category";
      this.method = "Add";
      this.$refs["confirmation"].show();
    },
    onCancel() {
      console.log("User cancelled the loader.");
    },
    async submitAddFinal() {
      const toAdd = this.categoryName;
      if (this.method === "Add") {
        await this.addCategory(toAdd).then(result => {
          if (result.data.success === true) {
            this.isLoading = true;
            this.$refs["confirmation"].hide();
            setTimeout(() => {
              this.isLoading = false;
              this.resetForm();
              this.getCatList();
              this.$toast.success("Successfully Added.", {
                rtl: false,
                timeOut: 3000,
                closeable: true
              });
            }, 2000);
          }

          if (result.data.success === false) {
            this.isLoading = false;
            this.errMsg = result.data.msg;
          }
        });
      } else {
        const toEdit = { id: this.id, catName: this.categoryNameToEdit };
        await this.editCategory(toEdit).then(res => {
          if (res.data.success === true) {
            this.isLoading = true;
            this.$refs["confirmation"].hide();
            setTimeout(() => {
              this.isLoading = false;
              this.resetForm();
              this.getCatList();
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

    // end ng pang add

    async edit(item, index, button) {
      this.categoryNameToEdit = item.category_name;
      this.id = item._id;
      this.$root.$emit("bv::show::modal", this.catInfoModal.id, button);
    },
    async onEditSubmit() {
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
</style>
