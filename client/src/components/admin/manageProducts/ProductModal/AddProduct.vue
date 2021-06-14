/* eslint-disable */
<template>
  <div class="row">
    <div class="col-lg-12">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <ValidationProvider
            name="Product Name"
            rules="required|min:3"
            v-slot="prodNameValidation"
          >
            <b-form-group
              label-for="prodName"
              label="Product Name"
              label-size="lg"
              label-cols-lg="3"
            >
              <b-form-input
                id="productName"
                name="prodName"
                type="text"
                v-model="prodName"
                class="form-control"
                :state="getValidationState(prodNameValidation)"
                aria-describedby="prodNameFeedBack"
                autocomplete="off"
              ></b-form-input>
              <b-form-invalid-feedback id="prodNameFeedBack">
                {{ prodNameValidation.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </ValidationProvider>
          <ValidationProvider
            name="Description"
            rules="required|min:3"
            v-slot="descValidation"
          >
            <b-form-group
              label-for="description"
              label="Description"
              label-size="lg"
              label-cols-lg="3"
            >
              <b-form-textarea
                id="textarea"
                v-model="description"
                placeholder="Enter something..."
                :state="getValidationState(descValidation)"
              ></b-form-textarea>
              <b-form-invalid-feedback id="unitPriceValFeedBack">
                <span>{{ descValidation.errors[0] }}</span>
              </b-form-invalid-feedback>
            </b-form-group>
          </ValidationProvider>
          <ValidationProvider
            name="Category"
            rules="required"
            v-slot="catValidation"
          >
            <b-form-group
              label-for="category"
              label="Category"
              label-size="lg"
              label-cols-lg="3"
            >
              <b-form-select
                id="category"
                v-model="cat"
                :options="options"
                :state="getValidationState(catValidation)"
              ></b-form-select>
              <b-form-invalid-feedback id="unitPriceValFeedBack">
                <span>{{ catValidation.errors[0] }}</span>
              </b-form-invalid-feedback>
            </b-form-group>
          </ValidationProvider>
          <ValidationProvider
            name="Unit Price"
            rules="customRequired|negNotAllowed"
            v-slot="unitPriceVal"
          >
            <b-form-group
              label-for="unit_price"
              label="Unit Price"
              label-size="lg"
              label-cols-lg="3"
            >
              <b-form-input
                id="unit_price"
                name="unit_price"
                type="text"
                v-model="unit_price"
                aria-describedby="unitPriceValFeedBack"
                :state="getValidationState(unitPriceVal)"
                autocomplete="off"
                v-money="money"
                @input.native="srpTotal"
              ></b-form-input>

              <b-form-invalid-feedback id="unitPriceValFeedBack">
                <span>{{ unitPriceVal.errors[0] }}</span>
              </b-form-invalid-feedback>
            </b-form-group>
          </ValidationProvider>
          <ValidationProvider
            name="Markup Price"
            rules="customRequired"
            v-slot="markUpVal"
          >
            <b-form-group
              label-for="markup_price"
              label="Markup Price"
              label-size="lg"
              label-cols-lg="3"
            >
              <b-form-input
                id="markup_price"
                name="markup_price"
                type="text"
                v-model="markup_price"
                aria-describedby="prodNameFeedBack"
                :state="getValidationState(markUpVal)"
                autocomplete="off"
                v-money="money"
                @input.native="srpTotal"
              ></b-form-input>

              <b-form-invalid-feedback id="prodNameFeedBack">
                <span>{{ markUpVal.errors[0] }}</span>
              </b-form-invalid-feedback>
            </b-form-group>
          </ValidationProvider>

          <b-form-group
            label-for="srp"
            label="SRP"
            label-size="lg"
            label-cols-lg="3"
          >
            <b-form-input
              id="srp"
              name="srp"
              type="text"
              v-model="srp"
              autocomplete="off"
              v-money="money"
              disabled
            ></b-form-input>
          </b-form-group>

          <b-button
            type="submit"
            variant="outline-success"
            class="btn btn-lg float-right"
          >
            Save
          </b-button>
        </form>
      </ValidationObserver>
    </div>
    <b-modal
      hide-footer
      @hide="onCancel()"
      ref="addProductModalConfirmation"
      title="CONFIRMATION"
      :header-bg-variant="confirmationModal.headerBgVariant"
      :header-text-variant="confirmationModal.headerTextVariant"
    >
      <p class="my-4">Are you sure you want to add {{ this.prodName }}?</p>
      <div class="alert alert-danger" v-if="errMsg">
        {{ errMsg }}
      </div>
      <b-button
        class="mt-3"
        variant="outline-success"
        block
        @click="submitFinal"
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
import { mapActions } from "vuex";
import { extend } from "vee-validate";
import { VMoney } from "v-money";

// extend("checkIf", {
//   validate(value) {
//     const b = parseInt(document.getElementById("unit_price").value);
//     const res = value < b;
//     console.log(res);
//     return res;
//   },
//   message: "To field must be less than that from field"
// });
extend("customRequired", {
  validate(value) {
    const unit = value.replace(/\D+/g, "");

    if (unit === "000") {
      return false;
    } else {
      return true;
    }
  },
  message: "{_field_} field is required."
});

extend("negNotAllowed", {
  validate(value) {
    const regex = /-/;
    const isExst = regex.test(value);

    if (isExst == true) {
      return false;
    }
    return true;
  },
  message: "Negative number is not allowed."
});

export default {
  directives: { money: VMoney },
  name: "addProductComp",
  data() {
    return {
      prodName: "",
      description: "",
      cat: "",
      unit_price: "",
      markup_price: "",
      srp: "",
      money: {
        decimal: ".",
        thousands: ",",
        prefix: "₱ ",
        suffix: "",
        precision: 2,
        masked: false
      },
      options: [],
      confirmationModal: {
        headerBgVariant: "dark",
        headerTextVariant: "light"
      },
      errMsg: ""
    };
  },
  props: ["categories"],
  mounted() {
    this.getCategories();
  },
  methods: {
    ...mapActions(["addProduct"]),
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async getCategories() {
      this.categories.forEach(data => {
        this.options.push({ value: data._id, text: data.category_name });
      });
    },
    async onSubmit() {
      this.$refs["addProductModalConfirmation"].show();
    },
    async submitFinal() {
      const srp = document.getElementById("srp").value;
      const product = {
        product_name: this.prodName,
        description: this.description,
        category: this.cat,
        unit_price: this.unit_price.replace(/\D+/, ""),
        markup_price: this.markup_price.replace(/\D+/, ""),
        SRP: srp.replace(/\D+/, "")
      };
      await this.addProduct(product).then(result => {
        if (result.data.success == true) {
          this.$refs["addProductModalConfirmation"].hide();
          this.$emit("clicked");
        }
        if (result.data.success === false) {
          this.errMsg = result.data.msg;
          this.confirmationModal.headerBgVariant = "danger";
        }
      });
    },
    srpTotal() {
      const unit = this.unit_price;
      const markup = this.markup_price;

      const total =
        Number(unit.replace(/\D+/g, "")) + Number(markup.replace(/\D+/g, ""));

      //   this.srp = total.toLocaleString("en-PH", {
      //     currency: "PHP",
      //     style: "currency"
      //   });
      // console.log(total);

      this.srp = total;
    },
    onCancel() {
      this.errMsg = "";
      this.$refs["addProductModalConfirmation"].hide();
      this.confirmationModal.headerBgVariant = "dark";
      this.confirmationModal.headerTextVariant = "light";
    }
    // onBlur(event) {
    //   this.$refs.observer.reset();
    // }
  }
};
</script>

<style scoped></style>
