<template>
  <div class="row">
    <div class="col-lg-12">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form class="editForm" @submit.stop.prevent="handleSubmit(onSubmit)">
          <validation-provider
            name="Category Name"
            :rules="{ required: true, min: 5 }"
            v-slot="catNameValidation"
          >
            <b-form-group
              label-cols="4"
              label-cols-lg="3"
              label-size="lg"
              label="Name"
              label-for="categoryName"
              class="mb-3"
            >
              <b-form-input
                id="categoryName"
                name="categoryName"
                type="text"
                class="form-control"
                placeholder="Category Name"
                v-model="categoryName"
                :state="getValidationState(catNameValidation)"
                aria-describedby="input-2-live-feedback"
                data-vv-as="categoryName"
                autocomplete="off"
                @blur.native="onBlur($event)"
              ></b-form-input>
              <b-form-invalid-feedback id="input-1-live-feedback">{{
                catNameValidation.errors[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
          <validation-provider
            name="Category Abbvreviation"
            :rules="{ required: true, min: 2 }"
            v-slot="catAbbvValidation"
          >
            <b-form-group
              class="inputMargin"
              label-cols="6"
              label-cols-lg="3"
              label-size="lg"
              label-align="left"
              label="Category Abbvreviation"
              label-for="categoryAbbv"
            >
              <b-form-input
                id="categoryAbbv"
                name="categoryAbbv"
                type="text"
                class="form-control b-0"
                placeholder="Category Abbvreviation"
                v-model="categoryAbbv"
                :state="getValidationState(catAbbvValidation)"
                aria-describedby="input-2-live-feedback"
                data-vv-as="categoryAbbv"
                autocomplete="off"
                @blur.native="onBlur($event)"
              ></b-form-input>
              <b-form-invalid-feedback id="input-1-live-feedback">{{
                catAbbvValidation.errors[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
          <b-button
            type="submit"
            class="mt-2 float-right "
            variant="outline-success"
            size="lg"
            >Save
          </b-button>
        </form>
      </validation-observer>
    </div>
    <b-modal
      hide-footer
      @hide="onCancel()"
      ref="addCatModalConfirmation"
      title="CONFIRMATION"
      :header-bg-variant="confirmationModal.headerBgVariant"
      :header-text-variant="confirmationModal.headerTextVariant"
    >
      <p class="my-4">Are you sure you want to edit {{ this.categoryName }}?</p>
      <div class="alert alert-danger" v-if="errMsg">
        {{ errMsg }}
      </div>
      <b-button
        class="mt-3"
        variant="outline-success"
        block
        @click="addCategoryFinal"
        >Yes</b-button
      >
      <b-button class="mt-3" variant="outline-danger" @click="onCancel()" block
        >No</b-button
      >
    </b-modal>
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters, mapState } from "vuex";
import store from "@/store";
import { mask } from "vue-the-mask";

export default {
  directives: { mask },
  name: "addCategoryComp",
  props: { catInfoProps: {} },
  data() {
    return {
      confirmationModal: {
        headerBgVariant: "dark",
        headerTextVariant: "light"
      },
      categoryName: "",
      categoryAbbv: "",
      errMsg: ""
    };
  },
  methods: {
    ...mapActions(["addCategory"]),
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    onSubmit() {
      this.$refs["addCatModalConfirmation"].show();
      // console.log(this.username);
    },

    onCancel() {
      this.errMsg = "";
      this.$refs["addCatModalConfirmation"].hide();
      this.confirmationModal.headerBgVariant = "dark";
      this.confirmationModal.headerTextVariant = "light";
    },
    async addCategoryFinal() {
      const toAdd = {
        categoryName: this.categoryName,
        catAbbv: this.categoryAbbv
      };
      await this.addCategory(toAdd).then(result => {
        if (result.data.success === true) {
          this.$refs["addCatModalConfirmation"].hide();
          this.$emit("clicked");
        }

        if (result.data.success === false) {
          this.errMsg = result.data.msg;
          this.confirmationModal.headerBgVariant = "danger";
        }
      });
    },
    onBlur(event) {
      this.$refs.observer.reset();
    }
  }
};
</script>

<style scoped>
.inputMargin {
  margin-bottom: -6px !important;
}
</style>
