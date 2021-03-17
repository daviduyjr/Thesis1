<template>
  <div class="row">
    <div class="col-lg-12">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form class="editForm" @submit.stop.prevent="handleSubmit(onSubmit)">
          <validation-provider
            name="Dist-No"
            :rules="{ required: true, min: 5 }"
            v-slot="distNoValidation"
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
                  id="Dist-No"
                  name="Dist-No"
                  type="text"
                  class="form-control"
                  placeholder="Dist-No"
                  v-model="dist_no"
                  :state="getValidationState(distNoValidation)"
                  aria-describedby="input-1-live-feedback"
                  :disabled="true"
                ></b-form-input>
                <b-form-invalid-feedback id="input-1-live-feedback">{{
                  distNoValidation.errors[0]
                }}</b-form-invalid-feedback>
              </div>
            </div>
          </validation-provider>
          <validation-provider
            name="distName"
            :rules="{ required: true, min: 5 }"
            v-slot="distNameValidation"
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
                  id="distName"
                  name="distName"
                  type="text"
                  class="form-control editFormInput"
                  placeholder="Distributor Name"
                  v-model="distributor_name"
                  :state="getValidationState(distNameValidation)"
                  aria-describedby="input-2-live-feedback"
                  data-vv-as="distName"
                ></b-form-input>
                <b-form-invalid-feedback id="input-2-live-feedback">{{
                  distNameValidation.errors[0]
                }}</b-form-invalid-feedback>
              </div>
            </div>
          </validation-provider>
          <!-- <validation-provider
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
          </validation-provider> -->

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
          <button type="submit" class="btn btn-primary btn-lg">
            Save
          </button>
        </form>
      </validation-observer>
      <b-modal hide-footer @hide="onCancel()" ref="my-modal" title="Add User">
        <p class="my-4">
          Are you sure you want to edit {{ this.distributor_name }} profile?
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
  name: "editDistributorComp",
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
  props: { distInfoProps: {} },
  methods: {
    ...mapActions(["editUserInfo", "newUserInfo"]),
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async editUserFinal() {
      // let distributor = {
      //   id: this.id,
      //   username: this.username,
      //   password: this.password,
      //   name: this.name,
      //   contact_number: this.contactNumber,
      //   address: this.address,
      //   role: this.selected,
      //   currentUserRole: store.state.Auth.currentUserRole,
      //   isActive: this.isActive ? "Yes" : "No"
      // };
      // console.log(distributor);
      // this.editUserInfo(distributor)
      //   .then(res => {
      //     if (res.data.success === true) {
      //       this.$refs["my-modal"].hide();
      //     }
      //     if (res.data.success === false) {
      //       this.errMsg = res.data.msg;
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    onSubmit() {
      this.$refs["my-modal"].show();
      // console.log(this.username);
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
    ...mapGetters(["distributor", "errorManageUser"])
  },
  mounted() {
    this.dist_no = this.distInfoProps.dist_no;
    this.distributor_name = this.distInfoProps.distributor_name;
    this.address = this.distInfoProps.address;
    this.contact_number = this.distInfoProps.contact_number;

    // if (this.isActive === "Yes") {
    //   this.isActive = true;
    //   this.checkIfActive = false;
    // } else {
    //   this.isActive = false;
    //   this.checkIfActive = true;
    // }
  }
};
</script>

<style scoped>
.switch {
  margin-bottom: 13px;
}
</style>
