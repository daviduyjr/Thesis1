/* eslint-disable */
<template>
  <div class="row">
    <div class="col-12">
      <b-button
        @click="addCustomerBtn"
        class="btn-block"
        pill
        variant="outline-primary"
        >Add Customer</b-button
      >
    </div>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(saveAndSelect)">
        <div class="wrapper" style="margin-left: 10px; margin-right: 10px;">
          <div class="col-12 addCustForm">
            <div class="row">
              <div class="col-12">
                <b-icon
                  style="cursor: pointer;"
                  @click="closeAddCustForm"
                  class="float-right mt-1"
                  icon="x-circle-fill"
                ></b-icon>
              </div>

              <div class="form-group col-sm-6 mb-1">
                <ValidationProvider
                  name="ID"
                  rules="required"
                  v-slot="idNoValidation"
                >
                  <small class="">ID</small>
                  <input
                    size="sm"
                    type="text"
                    class="form-control mt-1"
                    id="id_no"
                    v-model="id_no"
                    name="id_no"
                    :state="getValidationState(idNoValidation)"
                    aria-describedby="idNoFeedBack"
                    autocomplete="off"
                  />
                  <div class="text-danger">
                    <small> {{ idNoValidation.errors[0] }}</small>
                  </div>
                </ValidationProvider>
              </div>

              <div class="form-group col-sm-6 mb-1">
                <ValidationProvider
                  name="Name"
                  rules="required|min:3|alpha_spaces"
                  v-slot="nameValidation"
                >
                  <small class="">Name</small>
                  <input
                    size="sm"
                    type="text"
                    class="form-control mt-1"
                    id="full_name"
                    v-model="full_name"
                    :state="getValidationState(nameValidation)"
                    aria-describedby="idNoFeedBack"
                    autocomplete="off"
                  />
                  <div class="text-danger">
                    <small> {{ nameValidation.errors[0] }}</small>
                  </div>
                </ValidationProvider>
              </div>
              <div class="col-12 text-danger text-center">
                <small id="idErrorMsg"></small>
              </div>
              <b-button
                type="submit"
                class="btn-block m-2"
                pill
                variant="outline-primary"
                >Save/Select</b-button
              >
            </div>
          </div>
        </div>
      </form>
    </ValidationObserver>
    <div class="col-12">
      <div class="form-group">
        <small class="text-muted">Filter</small>
        <b-input-group size="sm">
          <b-form-input
            v-model="table.filter"
            type="search"
            id="filter-input"
            placeholder="Search customer."
          >
          </b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="col-12 table-sm">
      <b-table
        class=""
        sticky-header="272px"
        :items="customers"
        :fields="table.fields"
        :busy="table.isBusy"
        :filter="table.filter"
        head-variant="dark"
        small
        bordered
        responsive
        foot-clone
        show-empty
        empty-text="No transaction."
        tbody-td-class="rowClass"
      >
        <template #cell(actions)="row">
          <b-button
            size="sm"
            @click="selectCustomer(row.item, row.index, $event.target)"
            class="btn-success btn-block"
          >
            Select
          </b-button>
        </template>
      </b-table>
    </div>
    <div class="col-12">
      <div class="row perPagePagiGroup">
        <div class="col-6 ">
          <div class="form-group ">
            <b-form-select
              id="per-page-select"
              v-model="table.perPage"
              :options="table.pageOptions"
              size="md"
              class="perPage"
            ></b-form-select>
            <small class="text-muted">Per Page</small>
          </div>
        </div>
        <b-col cols="6" class="perPageSelect">
          <b-pagination
            class="float-right"
            v-model="table.currentPage"
            :total-rows="rows"
            :per-page="table.perPage"
          >
          </b-pagination>
        </b-col>
      </div>
    </div>
    <div class="col-12">
      <b-button
        @click="cancel"
        class="btn-block mt-1"
        pill
        variant="outline-warning"
        >Cancel</b-button
      >
    </div>
    <b-overlay :show="busy" no-wrap @shown="onShown">
      <template #overlay>
        <div v-if="processing" class="text-center">
          <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
          <p id="cancel-label">Please wait...</p>
        </div>
        <div
          v-else
          ref="dialog"
          tabindex="-1"
          role="dialog"
          aria-modal="false"
          aria-labelledby="form-confirm-label"
          class="text-center p-3"
        >
          <p><strong id="form-confirm-label">Are you sure?</strong></p>
          <div class="d-flex">
            <b-button
              variant="outline-danger"
              class="mr-3"
              @click="onCancelConfirmation"
            >
              Cancel
            </b-button>
            <b-button variant="outline-success" @click="saveAndSelectFinal"
              >OK</b-button
            >
          </div>
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<script>
/* eslint-disable */
import JQuery from "jquery";
import { mapActions } from "vuex";
import { listIndexes } from "../../../../server/models/inventory/RecievingOrder";

let $ = JQuery;
export default {
  name: "discountModal",
  props: ["type"],
  data() {
    return {
      customers: [],
      id_no: "",
      full_name: "",
      table: {
        filter: "",
        headVariant: "dark",
        perPage: 5,
        currentPage: 1,
        isBusy: false,
        sortBy: "product_name",
        pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
        fields: [
          {
            key: "id_no",
            label: "Id",
            sortable: true
          },
          {
            key: "full_name",
            label: "Name",
            sortable: true
          },
          { key: "actions", label: "Actions" }
        ],
        sortDirection: "desc"
      },
      //para sa overlay
      busy: false,
      processing: false
    };
  },
  mounted() {
    this.checkType();
  },
  computed: {
    customerListState() {
      return this.$store.state.Customer.customerList;
    },
    rows() {
      return this.customers.length;
    }
  },
  watch: {
    id_no: async function(value) {}
  },
  methods: {
    ...mapActions(["addCustomer"]),
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async checkType() {
      $(".addCustForm").hide();
      const list = await this.customerListState;
      const res = await list.filter(data => data.type == this.type);
      res.forEach(data => {
        this.customers.push({
          id_no: data.id_no,
          full_name: data.full_name
        });
      });
    },
    selectCustomer(item) {
      //console.log(item);
      this.$emit("customerSelected", item);
    },
    addCustomerBtn() {
      $(".addCustForm").show();
    },
    async saveAndSelect() {
      const list = this.customerListState;
      const bytype = await list.filter(data => data.type == this.type);
      const res = await bytype.filter(data => data.id_no == this.id_no);

      if (res.length > 0) {
        $("#idErrorMsg").text("Customer Already Exist");
        this.table.filter = this.id_no;
        return;
      } else {
        $("#idErrorMsg").text("");
        this.table.filter = "";
        this.processing = false;
        this.busy = true;
      }
    },
    async saveAndSelectFinal() {
      this.processing = true;
      const customer = {
        id_no: this.id_no,
        full_name: this.full_name,
        type: this.type
      };
      setTimeout(() => {
        this.addCustomer(customer).then(data => {
          console.log(data);
          if (data.success == true) {
            this.$emit("customerSelected", data.customer);
          }
        });
        console.log("asdf");
        this.processing = false;
        this.busy = false;
      }, 2000);
    },

    closeAddCustForm() {
      $(".addCustForm").hide();
      this.id_no = "";
      this.full_name = "";
    },
    cancel() {
      this.$emit("cancelDiscount");
    },
    onShown() {
      // Focus the dialog prompt
      this.$refs.dialog.focus();
    },
    onCancelConfirmation() {
      this.busy = false;
    }
  }
};
</script>

<style scoped>
.perPagePagiGroup {
  margin-top: -10px;
  margin-bottom: -17px;
}
.addCustForm {
  border: 1px solid #0000ff;
  border-radius: 10px 10px;
  margin-top: 4px;
  /* padding-left: 0px;
  padding-right: 2px; */
}
</style>
