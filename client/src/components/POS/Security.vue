<template>
  <div>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)">
        <div class="form-group col-sm-12 mb-1">
          <ValidationProvider
            name="Access Code"
            rules="required"
            v-slot="securityCodeValidation"
          >
            <small class="">Access Code</small>
            <input
              size="sm"
              type="password"
              class="form-control mt-1"
              id="securityCode"
              v-model="securityCode"
              name="securityCode"
              :state="getValidationState(securityCodeValidation)"
              autocomplete="off"
            />
            <div class="text-danger">
              <small> {{ securityCodeValidation.errors[0] }}</small>
            </div>
          </ValidationProvider>
        </div>
        <div class="col-12 text-danger text-center my-2" v-if="errMsg">
          {{ errMsg }}
          <b-icon-exclamation-triangle-fill
            variant="danger"
            animation="fade"
          ></b-icon-exclamation-triangle-fill>
        </div>
        <div class="col-12">
          <b-button
            type="submit"
            class="btn-block"
            pill
            variant="outline-primary"
            >Ok</b-button
          >
        </div>
        <div class="col-12">
          <b-button
            @click="cancel"
            class="btn-block mt-1"
            pill
            variant="outline-warning"
            >Cancel</b-button
          >
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions } from "vuex";
export default {
  name: "securityComp",
  data() {
    return {
      securityCode: "",
      errMsg: ""
    };
  },
  methods: {
    ...mapActions(["POSSecurity"]),
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async onSubmit() {
      const res = await this.POSSecurity(this.securityCode);
      if (res.success == true) {
        this.$emit("successAccess", res.userId);
        return;
      }
      this.errMsg = "Access Denied";
      this.$emit("accessDenied");
    },
    cancel() {
      this.$emit("cancelSecurity");
    }
  }
};
</script>

<style scoped></style>
