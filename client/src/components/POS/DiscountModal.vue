/* eslint-disable */
<template>
  <div class="row">
    <div class="col-12">
      <b-button
        @click="addCustomer"
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
                  rules="required|min:3"
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

              <!-- <div class="col-lg-6 mb-1">
                <ValidationProvider
                  name="Product Name"
                  rules="required|min:3"
                  v-slot="idNoValidation"
                >
                  <b-form-group
                    class="mb-0"
                    label-for="prodName"
                    label="ID"
                    label-size="sm"
                  >
                    <b-form-input
                      id="id_no"
                      name="id_no"
                      type="text"
                      v-model="id_no"
                      class="form-control"
                      :state="getValidationState(idNoValidation)"
                      aria-describedby="idNoFeedBack"
                      autocomplete="off"
                    ></b-form-input>
                    <b-form-invalid-feedback id="idNoFeedBack">
                      {{ idNoValidation.errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </ValidationProvider>
              </div> -->
              <div class="form-group col-sm-6 mb-1">
                <small class="">Name</small>
                <input
                  size="sm"
                  type="text"
                  class="form-control mt-1"
                  id="full_name"
                  v-model="full_name"
                />
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
  </div>
</template>

<script>
/* eslint-disable */
import JQuery from "jquery";
import { extend } from "vee-validate";

extend("testing", {
  validate(value) {
    console.log(value);
    // const unit = value.replace(/\D+/g, "");

    // if (unit === "000") {
    //   return false;
    // } else {
    //   return true;
    // }
  },
  message: "{_field_} field is required."
});

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
      }
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
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async checkType() {
      $(".addCustForm").hide();
      const list = this.customerListState;
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
    addCustomer() {
      $(".addCustForm").show();
    },
    saveAndSelect() {
      console.log("saveAndSelect");
    },
    closeAddCustForm() {
      $(".addCustForm").hide();
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
