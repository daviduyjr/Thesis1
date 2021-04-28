<template>
  <div class="row">
    <div class="col-lg-12">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form class="editForm" @submit.stop.prevent="handleSubmit(onSubmit)">
          <validation-provider
            name="Email"
            :rules="{ email: true, required: true, min: 5 }"
            v-slot="emailValidation"
          >
            <b-row class="my-1">
              <b-col sm="3" class="label">
                <label for="email" class="text-medium">Email:</label>
              </b-col>
              <b-col sm="9">
                <b-form-input
                  id="email"
                  name="email"
                  type="text"
                  class="form-control editFormInput"
                  v-model="email"
                  :state="getValidationState(emailValidation)"
                  aria-describedby="input-1-live-feedback"
                  :disabled="checkIfActive"
                  autocomplete="off"
                ></b-form-input>
                <b-form-invalid-feedback id="input-1-live-feedback">{{
                  emailValidation.errors[0]
                }}</b-form-invalid-feedback>
                <!-- </div> -->
              </b-col>
            </b-row>
          </validation-provider>

          <validation-provider
            name="Name"
            :rules="{ required: true, min: 5 }"
            v-slot="nameValidation"
          >
            <b-row class="my-1">
              <b-col sm="3" class="label">
                <label for="name" class="text-medium">Full Name:</label>
              </b-col>
              <b-col sm="9">
                <b-form-input
                  id="name"
                  name="name"
                  type="text"
                  class="form-control editFormInput"
                  placeholder="FullName"
                  v-model="name"
                  :state="getValidationState(nameValidation)"
                  aria-describedby="input-3-live-feedback"
                  data-vv-as="Name"
                  :disabled="checkIfActive"
                  autocomplete="off"
                ></b-form-input>

                <b-form-invalid-feedback id="input-3-live-feedback">{{
                  nameValidation.errors[0]
                }}</b-form-invalid-feedback>
              </b-col>
            </b-row>
          </validation-provider>
          <validation-provider
            name="Contact Number"
            :rules="{ required: true, min: 18 }"
            v-slot="contactNumberValidation"
          >
            <b-row class="my-1">
              <b-col sm="3" class="label">
                <label for="name" class="text-medium">Contact #:</label>
              </b-col>
              <b-col sm="9">
                <b-form-input
                  id="contactNumber"
                  name="contactNumber"
                  type="text"
                  class="form-control editFormInput"
                  placeholder="Contact Number (+63)-###-####-###"
                  v-model="contactNumber"
                  :state="getValidationState(contactNumberValidation)"
                  aria-describedby="input-4-live-feedback"
                  data-vv-as="contactNumber"
                  v-mask="['(+63) ###-####-###', '(+63) ###-####-###']"
                  :disabled="checkIfActive"
                  autocomplete="off"
                ></b-form-input>
                <b-form-invalid-feedback id="input-3-live-feedback"
                  >The Contact Number field is required</b-form-invalid-feedback
                >
              </b-col>
            </b-row>
          </validation-provider>
          <validation-provider
            name="Address"
            :rules="{ required: true, min: 5 }"
            v-slot="addressValidation"
          >
            <b-row class="my-1">
              <b-col sm="3" class="label">
                <label for="name" class="text-medium">Address:</label>
              </b-col>
              <b-col sm="9">
                <b-form-input
                  id="address"
                  name="address"
                  type="text"
                  class="form-control editFormInput"
                  placeholder="Address"
                  v-model="address"
                  :state="getValidationState(addressValidation)"
                  aria-describedby="input-5-live-feedback"
                  data-vv-as="Name"
                  :disabled="checkIfActive"
                  autocomplete="off"
                ></b-form-input>

                <b-form-invalid-feedback id="input-5-live-feedback">{{
                  addressValidation.errors[0]
                }}</b-form-invalid-feedback>
              </b-col>
            </b-row>
          </validation-provider>
          <validation-provider
            name="Role"
            :rules="{ required: true }"
            v-slot="roleValidation"
          >
            <b-row class="my-1">
              <b-col sm="3" class="label">
                <label for="name" class="text-medium">Role:</label>
              </b-col>
              <b-col sm="9">
                <b-form-select
                  id="roleSelect"
                  name="role"
                  class="editFormInput"
                  v-model="selected"
                  :options="options"
                  :state="getValidationState(roleValidation)"
                  aria-describedby="input-6-live-feedback"
                  data-vv-as="Role"
                  :disabled="checkIfActive"
                ></b-form-select>
                <b-form-invalid-feedback id="input-6-live-feedback">{{
                  roleValidation.errors[0]
                }}</b-form-invalid-feedback>
              </b-col>
            </b-row>
          </validation-provider>
          <div class="input-group switch">
            <b-form-checkbox
              id="isActiveSwitch"
              class="editFormInput switchBtn"
              v-model="isActive"
              name="check-button"
              switch
              @change="switchChange"
            >
              Is Active : <b>{{ isActive ? "Yes" : "No" }}</b>
            </b-form-checkbox>
          </div>
          <b-button
            type="submit"
            variant="outline-success"
            class="btn btn-lg float-right"
          >
            Save
          </b-button>
        </form>
      </validation-observer>
      <b-modal
        hide-footer
        @hide="onCancel()"
        ref="my-modal"
        title="Edit User Confirmation"
        :header-bg-variant="confirmationModal.headerBgVariant"
        :header-text-variant="confirmationModal.headerTextVariant"
      >
        <p class="my-4">
          Are you sure you want to edit {{ this.email }} profile?
        </p>
        <div class="alert alert-danger" v-if="errMsg">
          {{ errMsg }}
        </div>
        <b-button
          class="mt-3"
          variant="outline-success"
          block
          @click="editUserFinal"
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
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters, mapState } from "vuex";
import store from "@/store";
import { mask } from "vue-the-mask";

export default {
  directives: { mask },
  name: "editUsersProfile",
  data() {
    return {
      id: "",
      email: null,
      password: "",
      name: "",
      contactNumber: "",
      address: "",
      selected: null,
      options: [
        { value: null, text: "Please select a role" },
        { value: "user", text: "User" },
        { value: "supervisor", text: "Supervisor" },
        { value: "admin", text: "Administrator" }
      ],
      errMsg: "",
      isActive: "",
      checkIfActive: false,
      confirmationModal: {
        headerBgVariant: "info",
        headerTextVariant: "light"
      }
    };
  },
  props: { userProps: {} },
  methods: {
    ...mapActions(["editUserInfo", "newUserInfo"]),
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async editUserFinal() {
      let user = {
        id: this.id,
        email: this.email,
        name: this.name,
        contact_number: this.contactNumber,
        address: this.address,
        role: this.selected,
        currentUserRole: store.state.Auth.currentUserRole,
        isActive: this.isActive ? "Yes" : "No"
      };

      this.editUserInfo(user)
        .then(res => {
          if (res.data.success === true) {
            this.$refs["my-modal"].hide();
            this.$emit("clicked");
          }
          if (res.data.success === false) {
            this.errMsg = res.data.msg;
            this.confirmationModal.headerBgVariant = "danger";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onSubmit() {
      this.$refs["my-modal"].show();
    },
    onCancel() {
      this.errMsg = "";
      this.$refs["my-modal"].hide();
      this.confirmationModal.headerBgVariant = "info";
    },
    switchChange(e) {
      this.$nextTick(() => {
        if (e === false) {
          this.checkIfActive = true;
        } else {
          this.checkIfActive = false;
        }
      });
    }
  },
  computed: {
    ...mapGetters(["user", "errorManageUser"])
  },
  mounted() {
    this.id = this.userProps._id;
    this.email = this.userProps.email;
    this.password = "";
    this.selected = this.userProps.role;
    this.address = this.userProps.address;
    this.contactNumber = this.userProps.contact_number;
    this.name = this.userProps.name;
    this.isActive = this.userProps.isActive;

    if (this.isActive === "Yes") {
      this.isActive = true;
      this.checkIfActive = false;
    } else {
      this.isActive = false;
      this.checkIfActive = true;
    }
  }
};
</script>

<style scoped>
.switch {
  margin-bottom: 13px;
}

.label {
  padding-right: 0px !important;
  margin-top: 9px !important;
}
</style>
