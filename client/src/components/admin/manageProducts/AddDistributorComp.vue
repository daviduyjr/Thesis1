<template>
  <div class="row">
    <div class="col-lg-12">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form class="editForm" @submit.stop.prevent="handleSubmit(onSubmit)">
          <validation-provider
            name="Distributor's Name"
            :rules="{ required: true, min: 5 }"
            v-slot="distNameValidation"
          >
            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label-size="lg"
              label="Name"
              label-for="distName"
            >
              <b-form-input
                id="distName"
                name="distName"
                type="text"
                class="form-control editFormInput"
                placeholder="Distributor Name"
                v-model="distributor_name"
                :state="getValidationState(distNameValidation)"
                aria-describedby="input-2-live-feedback"
                data-vv-as="distName"
                autocomplete="off"
              ></b-form-input>
              <b-form-invalid-feedback id="input-2-live-feedback">{{
                distNameValidation.errors[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
          <validation-provider
            name="Address"
            :rules="{ required: true, min: 5 }"
            v-slot="addressValidation"
          >
            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label-size="lg"
              label="Address"
              label-for="address"
            >
              <b-form-input
                id="address"
                name="address"
                type="text"
                class="form-control editFormInput"
                placeholder="Address"
                v-model="address"
                :state="getValidationState(addressValidation)"
                aria-describedby="input-3-live-feedback"
                data-vv-as="address"
                autocomplete="off"
              ></b-form-input>

              <b-form-invalid-feedback id="input-3-live-feedback">{{
                addressValidation.errors[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
          <validation-provider
            name="Contact Number"
            :rules="{ required: true, min: 18 }"
            v-slot="contactNumberValidation"
          >
            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label-size="lg"
              label="Contact #"
              label-for="contactNumber"
            >
              <b-form-input
                id="contactNumber"
                name="contactNumber"
                type="text"
                class="form-control editFormInput"
                placeholder="Contact Number (+63)-###-####-###"
                v-model="contact_number"
                :state="getValidationState(contactNumberValidation)"
                aria-describedby="input-4-live-feedback"
                data-vv-as="contactNumber"
                v-mask="['(+63) ###-####-###', '(+63) ###-####-###']"
                autocomplete="off"
              ></b-form-input>
              <b-form-invalid-feedback id="input-3-live-feedback"
                >The Contact Number field is required</b-form-invalid-feedback
              >
            </b-form-group>
          </validation-provider>

          <!--  <div class="input-group switch">
            <b-form-checkbox
              id="isActiveSwitch"
              class="editFormInput"
              v-model="isActive"
              name="check-button"
              switch
              @change="switchChange"
            >
              Is Active : <b>{{ isActive ? "Yes" : "No" }}</b>
            </b-form-checkbox>
          </div> -->

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
      ref="addDistModalConfirmation"
      title="EDIT INFO"
    >
      <p class="my-4">
        Are you sure you want to edit {{ this.distributor_name }}?
      </p>
      <div class="alert alert-danger" v-if="errMsg">
        {{ errMsg }}
      </div>
      <b-button
        class="mt-3"
        variant="outline-success"
        block
        @click="addDistributorFinal"
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
  name: "addDistributorComp",
  props: { distInfoProps: {} },
  data() {
    return {
      dist_no: "",
      distributor_name: null,
      address: "",
      contact_number: "",
      selected: null,
      errMsg: ""
    };
  },
  methods: {
    ...mapActions(["addDistributor"]),
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    onSubmit() {
      this.$refs["addDistModalConfirmation"].show();
      // console.log(this.username);
    },

    onCancel() {
      this.errMsg = "";
      this.$refs["addDistModalConfirmation"].hide();
    },

    async addDistributorFinal() {
      let distributor = {
        distributor_name: this.distributor_name,
        address: this.address,
        contact_number: this.contact_number
        // isActive: this.isActive ? "Yes" : "No"
      };

      const result = await this.addDistributor(distributor);

      if (result.data.success == true) {
        this.$refs["addDistModalConfirmation"].hide();
        this.$emit("clicked");
      }
      if (result.data.success == false) {
        this.errMsg = result.data.msg;
      }
    }
  }
};
</script>

<style scoped></style>
