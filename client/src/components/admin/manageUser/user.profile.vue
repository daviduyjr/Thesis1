<template>
  <section class="register">
    <div class="row">
      <div class="col-12">
        <!-- <div class="col-lg-12 grid-margin stretch-card">
        <div class="card" v-if="newUser">
          <div class="card-body">
            <h2 class="card-title text-center">User Profile</h2> -->
        <ul class="list group">
          <li class="list-group-item">
            User ID : <strong>{{ this.user.user_id }}</strong>
          </li>
          <li class="list-group-item">
            Username :<strong> {{ this.user.email }}</strong>
          </li>
          <li class="list-group-item">
            Role :<strong> {{ this.user.role }}</strong>
          </li>
          <li class="list-group-item">
            Full Name :<strong> {{ this.user.name }}</strong>
          </li>
          <li class="list-group-item">
            Contact :<strong> {{ this.user.contactNumber }}</strong>
          </li>
          <li class="list-group-item">
            Address :<strong> {{ this.user.address }}</strong>
          </li>
          <li class="list-group-item">
            IsActive : <strong>{{ this.user.isActive }}</strong>
          </li>
        </ul>
      </div>
      <!-- </div>
        </div>
      </div> -->
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters, mapState } from "vuex";
import store from "@/store";

export default {
  name: "userInfo",
  data: () => {
    return {
      user: {
        user_id: "",
        email: "",
        role: "",
        name: "",
        contactNumber: "",
        address: "",
        isActive: ""
      }
    };
  },
  computed: {
    ...mapGetters(["currentUserRole", "userUpdated"]),
    updatedUser() {
      return this.$store.state.manageUser.userUpdated;
    },

    newUser() {
      return this.$store.state.manageUser.newUser;
    },

    typeOfMethod() {
      return this.$store.state.manageUser.method;
    }
  },
  methods: {
    userProfile2() {
      if (this.typeOfMethod === "updateUser") {
        console.log("updatedUser", this.updatedUser);
        this.user.user_id = this.updatedUser.user_id;
        this.user.email = this.updatedUser.email;
        this.user.role = this.updatedUser.role;
        this.user.name = this.updatedUser.name;
        this.user.contactNumber = this.updatedUser.contact_number;
        this.user.address = this.updatedUser.address;
        this.user.isActive = this.updatedUser.isActive;
        return;
      }

      if (this.typeOfMethod === "addUser") {
        console.log("newUser", this.newUser);
        this.user.user_id = this.newUser.user_id;
        this.user.email = this.newUser.email;
        this.user.role = this.newUser.role;
        this.user.name = this.newUser.name;
        this.user.contactNumber = this.newUser.contact_number;
        this.user.address = this.newUser.address;
        this.user.isActive = this.newUser.isActive;
        return;
      }
    }
  },
  created() {},

  mounted() {
    this.userProfile2();
  }
};
</script>
<style scoped>
.card-title {
  font-size: 27px;
}
</style>
