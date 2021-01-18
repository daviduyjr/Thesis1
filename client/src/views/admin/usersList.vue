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
                    primary-key="_id"
                  >
                    <template #cell(actions)="row">
                      <b-button size="sm" @click="row.toggleDetails">
                        {{ row.detailsShowing ? "Hide" : "Show" }} Details
                      </b-button>
                      <b-button
                        size="sm"
                        @click="info(row.item, row.index, $event.target)"
                        class="mr-1"
                      >
                        Edit
                      </b-button>
                    </template>
                    <template #row-details="row">
                      <b-card>
                        <ul>
                          <li>
                            Username : <strong>{{ row.item.username }}</strong>
                          </li>
                          <li>
                            Role : <strong>{{ row.item.role }}</strong>
                          </li>
                          <li>
                            Name : <strong>{{ row.item.name }}</strong>
                          </li>
                          <li>
                            Contact Number :
                            <strong>{{ row.item.contact_number }}</strong>
                          </li>
                          <li>
                            Address : <strong>{{ row.item.address }}</strong>
                          </li>
                          <li>
                            Is Active :
                            <strong>{{
                              row.item.isActive ? "YES" : "NO"
                            }}</strong>
                          </li>
                        </ul>
                      </b-card>
                    </template>
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
          </div>
          <!-- <b-modal
            hide-footer
            :id="infoModal.id"
            title="USERS INFO"
            @hide="resetInfoModal"
          >
            <ul class="list group">
              <li class="list-group-item">
                Username :<strong> {{ infoModal.content.username }}</strong>
              </li>
              <li class="list-group-item">
                Role :<strong> {{ infoModal.content.role }}</strong>
              </li>
              <li class="list-group-item">
                Name :<strong> {{ infoModal.content.name }}</strong>
              </li>
              <li class="list-group-item">
                Contact :<strong>
                  {{ infoModal.content.contact_number }}</strong
                >
              </li>
              <li class="list-group-item">
                Address :<strong> {{ infoModal.content.address }}</strong>
              </li>
              <li
                class="list-group-item"
                v-if="infoModal.content.isActive === true"
              >
                Is Active :<strong> YES </strong>
              </li>
              <li class="list-group-item" v-else>
                Is Active :<strong> NO </strong>
              </li>
            </ul>
            <b-button
              class="mt-3"
              variant="outline-success"
              block
              @click="editUser"
              >EDIT</b-button
            >
          </b-modal> -->
          <b-modal
            hide-footer
            :id="infoModal.id"
            title="EDIT USERS INFO"
            @hide="resetInfoModal"
          >
            <editUsersProfile :userProps="infoModal.content" />
          </b-modal>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */

import editUsersProfile from "@/components/admin/manageUser/editUsersProfile";
import axios from "axios";
import store from "@/store";
export default {
  name: "usersList",
  components: { editUsersProfile },
  data() {
    return {
      filter: "",
      tableVariants: "dark",
      perPage: 3,
      currentPage: 1,
      isBusy: false,
      fields: [
        { key: "name", sortable: true, label: "Full Name" },
        { key: "role" },
        {
          key: "isActive",
          formatter: (value, key, item) => {
            return value ? "Yes" : "No";
          }
        },
        { key: "actions", label: "Actions" }
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
      users: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: {}
      }
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
  },
  methods: {
    info(item, index, button) {
      this.infoModal.title = "INFO";
      this.infoModal.content = item;
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    editUser() {
      alert("edit");
    }
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
