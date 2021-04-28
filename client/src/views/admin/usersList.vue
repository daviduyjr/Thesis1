<template>
  <section class="userslist">
    <b-overlay
      :variant="overlay.variant"
      :opacity="overlay.opacity"
      :blur="overlay.blur"
      :show="overlay.show"
      rounded="sm"
    >
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title text-center">Users List</h2>
              <b-row md="3">
                <b-col cols="5" class="">
                  <button
                    class="btn btn-lg btn-success btnAdd"
                    @click="addUser()"
                  >
                    ADD USER
                  </button>
                </b-col>

                <b-col cols="2"></b-col>
                <b-col cols="5">
                  <b-form-group
                    label="Filter"
                    label-for="filter-input"
                    label-cols-sm="1"
                    label-cols-lg="2"
                    label-align-lg="left"
                    label-size="lg"
                    class="mb-2"
                  >
                    <b-input-group size="md">
                      <b-form-input
                        v-model="filter"
                        type="search"
                        placeholder="Search"
                        debounce="0"
                      >
                      </b-form-input>
                      <b-input-group-append>
                        <button
                          :disabled="!filter"
                          @click="filter = ''"
                          class="btn btn-dark"
                        >
                          Clear
                        </button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>

              <b-row>
                <b-col sm="5" md="5" class="my-1">
                  <b-form-group
                    label="Per page"
                    label-for="per-page-select"
                    label-cols-sm="1"
                    label-cols-md="2"
                    label-cols-lg="2"
                    label-align-sm="left"
                    label-size="md"
                    class="mb-0 perPageLabel"
                  >
                    <!-- <label class="perPageLabel">Per page:</label> -->
                    <b-form-select
                      id="per-page-select"
                      v-model="perPage"
                      :options="pageOptions"
                      size="md"
                      class="perPage"
                    ></b-form-select>
                  </b-form-group>
                </b-col>
                <b-col cols="2"></b-col>
                <b-col cols="5" class="float-right">
                  <b-form-group
                    v-model="sortDirection"
                    label="Filter On"
                    description="Leave all unchecked to filter on all data"
                    label-cols-sm="2"
                    label-align-md="right"
                    label-size="md"
                    class="mb-0 borderStyle"
                    v-slot="{ ariaDescribedby }"
                  >
                    <b-form-checkbox-group
                      v-model="filterOn"
                      :options="options"
                      :aria-describedby="ariaDescribedby"
                      class="mt-1"
                    >
                    </b-form-checkbox-group>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row md="3">
                <b-col cols="12">
                  <div class="mt-2 mb-2">
                    <b-table
                      id="usersTable"
                      class="table"
                      :bordered="bordered"
                      :hover="true"
                      :items="users"
                      :fields="fields"
                      :head-variant="headVariant"
                      :filter="filter"
                      :fixed="fixed"
                      :filter-included-fields="filterOn"
                      :per-page="perPage"
                      :current-page="currentPage"
                      :busy.sync="isBusy"
                      primary-key="_id"
                      responsive="sm"
                      :sort-by.sync="sortBy"
                      :sort-desc.sync="sortDesc"
                      empty-text="There is no messages to show"
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
                              User ID:
                              <strong>{{ row.item.user_id }}</strong>
                            </li>
                            <li>
                              Email :
                              <strong>{{ row.item.email }}</strong>
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
                              <strong>{{ row.item.isActive }}</strong>
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
            <b-modal
              hide-footer
              :id="infoModal.id"
              title="EDIT USERS INFO"
              @hide="resetInfoModal"
              ref="editUsersModal"
              :header-bg-variant="modal.headerBgVariant"
              :header-text-variant="modal.headerTextVariant"
            >
              <editUsersProfile
                :userProps="infoModal.content"
                @clicked="editSuccess"
              />
            </b-modal>

            <b-modal
              size="md"
              hide-footer
              title="ADD USER"
              :header-bg-variant="modal.headerBgVariant"
              :header-text-variant="modal.headerTextVariant"
              ref="addUserModal"
            >
              <addUser @clicked="addUserSuccess" />
            </b-modal>
            <b-modal
              size="md"
              hide-footer
              title="USERS PROFILE"
              :header-bg-variant="modal.headerBgVariant"
              :header-text-variant="modal.headerTextVariant"
              ref="usersProfileModal"
            >
              <userProfile />
            </b-modal>
          </div>
        </div>
      </div>
    </b-overlay>
  </section>
</template>

<script>
/* eslint-disable */
import axios from "axios";
import "vue-loading-overlay/dist/vue-loading.css";

import editUsersProfile from "@/components/admin/manageUser/editUsersProfile";
import addUser from "@/components/admin/manageUser/AddUser";
import userProfile from "@/components/admin/manageUser/user.profile";
export default {
  name: "usersList",
  components: { editUsersProfile, addUser, userProfile },
  data() {
    return {
      modal: {
        headerBgVariant: "dark",
        headerTextVariant: "light"
      },
      filter: "",
      headVariant: "dark",
      perPage: 5,
      currentPage: 1,
      isBusy: false,
      sortBy: "user_id",
      sortDesc: false,
      bordered: true,
      fixed: false,
      fields: [
        { key: "email", sortable: true, label: "Email" },
        { key: "name", sortable: true, label: "Full Name" },
        { key: "role", sortable: false },
        {
          key: "isActive",
          sortable: false,
          thStyle: { width: "20%" }
        },
        { key: "actions", label: "Actions", thStyle: { width: "18%" } }
      ],
      options: [
        { text: "Email", value: "email" },
        { text: "Name", value: "name" },
        { text: "Role", value: "role" },
        { text: "isActive", value: "isActive" }
      ],
      users: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: {}
      },
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      filterOn: [],
      sortDirection: "asc",
      overlay: {
        show: false,
        variant: "transparent",
        opacity: 0.89,
        blur: "2px"
      }
    };
  },
  computed: {
    rows() {
      return this.users.length;
    }
  },
  mounted() {
    this.getUsersList();
  },
  methods: {
    getUsersList() {
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
        })
        .catch(err => {
          console.log("may error");
        });
    },
    info(item, index, button) {
      const trIndex = index + 1;
      localStorage.setItem("index", trIndex);
      // const trIndexs = localStorage.getItem("index");
      // var x = document.getElementById("usersTable").rows[trIndexs].cells[4]
      //   .children[0];
      // x.click();
      // console.log(x);
      this.infoModal.title = "INFO";
      this.infoModal.content = item;
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    addUser() {
      this.$refs["addUserModal"].show();
    },
    addUserSuccess() {
      this.$refs["addUserModal"].hide();
      this.overlay.show = true;
      setTimeout(() => {
        this.getUsersList();
        this.overlay.show = false;
        this.$refs["usersProfileModal"].show();
        this.$toast.success("Successfully Added.", {
          rtl: false,
          timeOut: 2000,
          closeable: true
        });
      }, 2000);
    },
    editSuccess() {
      this.$refs["editUsersModal"].hide();
      this.overlay.show = true;

      setTimeout(() => {
        this.getUsersList();
        this.overlay.show = false;
        this.$refs["usersProfileModal"].show();
        this.$toast.success("Successfully Saved", {
          rtl: false,
          timeOut: 2000,
          closeable: true
        });
      }, 2000);
    }
    // tryLang() {
    //wag burahin pang acccess ko sa DOM to
    //   const trIndex = localStorage.getItem("index");
    //   var x = document.getElementById("usersTable").rows[trIndex].cells[4]
    //     .children[0];
    //   x.click();
    // }
  }
};
</script>

<style scoped>
.card-title {
  font-size: 27px;
}
.actionClass {
  max-width: 50px;
}
.checkBoxLbl {
  padding-top: 5.5px !important;
}

.borderStyle {
  border: 1px solid #0000ff;
  border-radius: 10px 10px;
}

.btnAdd {
  margin-bottom: 9px !important;
  padding-left: 60px;
  padding-right: 60px;
}
</style>
