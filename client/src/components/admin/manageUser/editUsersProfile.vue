<template>
  <div class="row">
    <div class="col-lg-12">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form class="editForm" @submit.stop.prevent="handleSubmit(onSubmit)">
          <validation-provider
            name="UserName"
            :rules="{ required: true, min: 5 }"
            v-slot="usernameValidation"
          >
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i
                      class="mdi mdi-account-outline"
                      style="font-size: 1.4rem;"
                    ></i>
                  </span>
                </div>
                <b-form-input
                  id="username"
                  name="username"
                  type="text"
                  class="form-control editFormInput"
                  placeholder="Username"
                  v-model="username"
                  :state="getValidationState(usernameValidation)"
                  aria-describedby="input-1-live-feedback"
                  :disabled="checkIfActive"
                ></b-form-input>
                <b-form-invalid-feedback id="input-1-live-feedback">{{
                  usernameValidation.errors[0]
                }}</b-form-invalid-feedback>
              </div>
            </div>
          </validation-provider>
          <validation-provider
            name="Password"
            :rules="{ required: true, min: 5 }"
            v-slot="passwordValidation"
          >
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i
                      class="mdi mdi-lock-outline"
                      style="font-size: 1.4rem;"
                    ></i>
                  </span>
                </div>
                <b-form-input
                  id="password"
                  name="password"
                  type="password"
                  class="form-control editFormInput"
                  placeholder="Password"
                  v-model="password"
                  :state="getValidationState(passwordValidation)"
                  aria-describedby="input-2-live-feedback"
                  data-vv-as="Username"
                  :disabled="checkIfActive"
                ></b-form-input>
                <b-form-invalid-feedback id="input-2-live-feedback">{{
                  passwordValidation.errors[0]
                }}</b-form-invalid-feedback>
              </div>
            </div>
          </validation-provider>
          <validation-provider
            name="Name"
            :rules="{ required: true, min: 5 }"
            v-slot="nameValidation"
          >
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i
                      class="mdi mdi-account-box"
                      style="font-size: 1.4rem;"
                    ></i>
                  </span>
                </div>
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
                ></b-form-input>

                <b-form-invalid-feedback id="input-3-live-feedback">{{
                  nameValidation.errors[0]
                }}</b-form-invalid-feedback>
              </div>
            </div>
          </validation-provider>
          <validation-provider
            name="Contact Number"
            :rules="{ required: true, min: 18 }"
            v-slot="contactNumberValidation"
          >
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i
                      class="mdi mdi-cellphone-android"
                      style="font-size: 1.4rem;"
                    ></i>
                  </span>
                </div>
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
                ></b-form-input>
                <b-form-invalid-feedback id="input-3-live-feedback"
                  >The Contact Number field is required</b-form-invalid-feedback
                >
              </div>
            </div>
          </validation-provider>
          <validation-provider
            name="Address"
            :rules="{ required: true, min: 5 }"
            v-slot="addressValidation"
          >
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="mdi mdi-home" style="font-size: 1.4rem;"></i>
                  </span>
                </div>
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
                ></b-form-input>

                <b-form-invalid-feedback id="input-5-live-feedback">{{
                  addressValidation.errors[0]
                }}</b-form-invalid-feedback>
              </div>
            </div>
          </validation-provider>
          <validation-provider
            name="Role"
            :rules="{ required: true }"
            v-slot="roleValidation"
          >
            <div class="form-group row">
              <div class="input-group">
                <div class="col-md-7">
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
                </div>
              </div>
              <b-form-invalid-feedback id="input-6-live-feedback">{{
                roleValidation.errors[0]
              }}</b-form-invalid-feedback>
            </div>
          </validation-provider>
          <div class="input-group switch">
            <b-form-checkbox
              id="isActiveSwitch"
              class="editFormInput"
              v-model="isActive"
              name="check-button"
              switch
              @change="switchChange"
            >
              Is Active : <b>{{ isActive ? "YES" : "NO" }}</b>
            </b-form-checkbox>
          </div>
          <button type="submit" class="btn btn-primary btn-lg">
            Save
          </button>
        </form>
      </validation-observer>
      <b-modal hide-footer @hide="onCancel()" ref="my-modal" title="Add User">
        <p class="my-4">
          Are you sure you want to add this {{ this.username }}?
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
      username: null,
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
      isActive: false,
      checkIfActive: false
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
        username: this.username,
        password: this.password,
        name: this.name,
        contact_number: this.contactNumber,
        address: this.address,
        role: this.selected,
        currentUserRole: store.state.Auth.currentUserRole,
        isActive: this.isActive
      };
      console.log(user);
      this.editUserInfo(user)
        .then(res => {
          if (res.data.success === true) {
            this.$refs["my-modal"].hide();
          }
          if (res.data.success === false) {
            this.errMsg = res.data.msg;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onSubmit() {
      this.$refs["my-modal"].show();
      console.log(this.username);
    },
    onCancel() {
      this.errMsg = "";
      this.$refs["my-modal"].hide();
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
    const inputEl = document.querySelectorAll(".editFormInput");
    this.id = this.userProps._id;
    this.username = this.userProps.username;
    this.password = "";
    this.selected = this.userProps.role;
    this.address = this.userProps.address;
    this.contactNumber = this.userProps.contact_number;
    this.name = this.userProps.name;
    this.isActive = this.userProps.isActive;
    if (this.isActive === true) {
      this.checkIfActive = false;
    } else {
      this.checkIfActive = true;
    }
  }
};
</script>

<style scoped>
.switch {
  margin-bottom: 13px;
}
</style>
