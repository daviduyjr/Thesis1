<template>
  <section class="userslist">
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title">Users List</h2>
            <b-table striped hover :items="users"></b-table>
            {{ users }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import axios from "axios";
import store from "@/store";
export default {
  name: "usersList",
  data() {
    return {
      //   items: [
      //     { age: 40, first_name: "Dickerson", last_name: "Macdonald" },
      //     { age: 21, first_name: "Larsen", last_name: "Shaw" },
      //     { age: 89, first_name: "Geneva", last_name: "Wilson" },
      //     { age: 38, first_name: "Jami", last_name: "Carney" }
      //   ]
      users: [
        {
          name: "",
          contact_number: "",
          address: "",
          role: ""
        }
      ]
    };
  },
  mounted() {
    axios
      .get("http://localhost:5000/api/admin/usersList", {
        params: {
          role: localStorage.getItem("role")
        }
      })
      .then(({ data }) => {
        debugger;
        if (data.lenght === 0) {
          alert("no data");
        }
        // this.users.name = data.users[0].name;
        // this.users.contact_number = data.users[1].contact_number;
        // this.users.address = data.users[2].address;
        // this.users.role = data.users[3].role;
        this.users = data.users;
        console.log(data.users[0].name);
      })
      .catch(err => {
        console.log("may error");
      });
  }
};
</script>

<style scoped></style>
