<template>
  <section class="register">
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card" v-if="newUser">
          <div class="card-body">
            <h2 class="card-title">User Profile</h2>
            <ul class="list group">
              <li class="list-group-item">
                Username :<strong> {{ newUser.username }}</strong>
              </li>
              <li class="list-group-item">
                Role :<strong> {{ newUser.role }}</strong>
              </li>
              <li class="list-group-item">
                Name :<strong> {{ newUser.name }}</strong>
              </li>
              <li class="list-group-item">
                Contact :<strong> {{ newUser.contact_number }}</strong>
              </li>
              <li class="list-group-item">
                Address :<strong> {{ newUser.address }}</strong>
              </li>
            </ul>
            <button
              class="btn btn-primary btn-lg"
              to="/editProfile"
              @click="editUsersInfo()"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
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
        username: "",
        role: "",
        name: "",
        contactNumber: "",
        address: ""
      }
    };
  },
  computed: {
    ...mapGetters(["newUser", "currentUserRole"])
    // ...mapState(["newUser"])
  },
  methods: {
    ...mapActions(["newUserInfo"]),
    editUsersInfo() {
      alert("adsfasdf");
      this.$router.push({ path: "/editProfile" });
    }
  },
  created() {},
  // },
  mounted() {
    const items = {
      id: this.$route.params.id,
      role: localStorage.getItem("role")
    };
    this.newUserInfo(items);
  }
};
</script>
