<template>
  <section class="userslist">
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center">Users List</h2>
            <b-row md="3">
              <b-col cols="4">
                <b-form-input
                  v-model="filter"
                  type="search"
                  placeholder="Search"
                >
                </b-form-input>
              </b-col>
            </b-row>
            <b-row md="3">
              <b-col cols="12">
                <div class="table-responsive mt-2 mb-2">
                  <b-table
                    class="table"
                    :fixed="true"
                    :bordered="true"
                    :hover="true"
                    :items="users"
                    :fields="fields"
                    :head-variant="tableVariants"
                    sort-icon-left
                    :filter="filter"
                    :per-page="perPage"
                    :current-page="currentPage"
                    :busy.sync="isBusy"
                    :actions="[]"
                  >
                  </b-table>
                </div>
              </b-col>
            </b-row>
            <b-row md="3">
              <b-col cols="12">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rows"
                  :per-page="perPage"
                >
                </b-pagination>
              </b-col>
            </b-row>
            <!-- {{ users }} -->
            <!-- <table
              id="example"
              class="table table-striped table-bordered"
              style="width:100%"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact Number</th>
                  <th>Address</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user._id">
                  <td :key="user._id" style="display:none;">{{ user._id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.contact_number }}</td>
                  <td>{{ user.address }}</td>
                  <td>{{ user.role }}</td>
                </tr>
              </tbody>
            </table> -->
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
      filter: "",
      tableVariants: "dark",
      perPage: 2,
      currentPage: 1,
      isBusy: false,
      fields: [
        { key: "_id" },
        { key: "name", sortable: true, label: "Full Name" },
        { key: "contact_number" },
        { key: "address" },
        { key: "role" },
        "Actions"
      ],
      actions: [
        {
          text: "Delete",
          color: "danger",
          action: (row, index) => {
            alert(`about to delete ${row.first_name} ${row.last_name}`);
          }
        }
      ],
      users: []
    };
  },
  computed: {
    rows() {
      return this.users.length;
    }
  },
  mounted() {
    this.isBusy = true;
    axios
      .get("http://localhost:5000/api/admin/usersList", {
        params: {
          role: localStorage.getItem("role")
        }
      })
      .then(({ data }) => {
        this.isBusy = false;
        if (data.lenght === 0) {
          alert("no data");
        }
        this.users = data.users;
        console.log("data", data.users.length);
      })
      .catch(err => {
        console.log("may error");
      });
  }
};
</script>

<style scoped>
.table {
  width: 100%;
  color: #212529;
}
table {
  border-collapse: collapse;
}
.card-title {
  font-size: 27px;
}
</style>
