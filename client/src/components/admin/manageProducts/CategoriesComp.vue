<template>
  <section class="register">
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center">Categories</h2>

            <form @submit.stop.prevent="onSubmit">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <div class="input-group">
                      <b-form-input
                        id="categoryName"
                        name="categoryName"
                        type="text"
                        class="form-control"
                        placeholder="Add Category"
                        v-model="$v.categoryName.$model"
                        :state="validateState('categoryName')"
                        aria-describedby="input-1-live-feedback"
                        autocomplete="off"
                      ></b-form-input>
                      <b-form-invalid-feedback id="input-1-live-feedback">
                        This is a required field and must be at least 3
                        characters.
                      </b-form-invalid-feedback>
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
                    placeholder="Type to Search Category"
                  ></b-form-input>
                </div>
              </div>
            </form>

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
          </div>
        </div>
      </div>
    </div>
    <b-modal
      hide-footer
      :id="catInfoModal.id"
      title="EDIT CATEGORIES"
      @hide="resetInfoModal"
      ref="modal-catNameEdit"
    >
      <form class="editCatForm" @submit.stop.prevent="onEditSubmit">
        <b-form-group label="Category Name" label-for="name-input">
          <b-form-input
            id="categoryName"
            v-model="categoryNameToEdit"
            autocomplete="off"
          ></b-form-input>
        </b-form-group>

        <button type="submit" class="btn btn-primary btn-lg">
          Save
        </button>
      </form>
    </b-modal>
    <b-modal
      hide-footer
      @hide="onCancel()"
      ref="confirmation"
      :title="this.confirmationModal.title"
    >
      <p class="my-4">
        Are you sure you want to {{ this.method }} {{ this.categoryName }} ?
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
      <b-button class="mt-3" variant="outline-danger" @click="onCancel()" block
        >No</b-button
      >
    </b-modal>
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters, mapState } from "vuex";
import store from "@/store";
import { mask } from "vue-the-mask";
import axios from "axios";
import router from "../../../router";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: "CategoriesComp",
  mixins: [validationMixin],
  data() {
    return {
      filter: "",
      headVariant: "dark",
      perPage: 5,
      currentPage: 1,
      isBusy: false,
      sortBy: "name",
      sortDesc: false,
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
      errMsg: ""
    };
  },
  validations: {
    categoryName: { required, minLength: minLength(3) }
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

    validateState(categoryName) {
      const { $dirty, $error } = this.$v.categoryName;
      return $dirty ? !$error : null;
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
        })
        .catch(err => {
          console.log("may error");
        });
    },
    // start ng pang add
    resetForm() {
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
      this.$nextTick(() => {
        this.$v.$reset();
      });
    },

    onSubmit() {
      this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }
      this.confirmationModal.title = "Add Category";
      this.method = "Add";
      this.$refs["confirmation"].show();
    },

    async submitAddFinal() {
      const toAdd = this.categoryName;
      if (this.method === "Add") {
        await this.addCategory(toAdd).then(result => {
          if (result.data.success === true) {
            this.resetForm();
            this.getCatList();
            this.$refs["confirmation"].hide();
            alert("Form submitted!");
          }
        });
      } else {
        const toEdit = { id: this.id, catName: this.categoryNameToEdit };
        await this.editCategory(toEdit).then(res => {
          if (res.data.success === true) {
            this.resetForm();
            this.getCatList();
            this.$refs["confirmation"].hide();
          }
          if (res.data.success === false) {
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
</style>
