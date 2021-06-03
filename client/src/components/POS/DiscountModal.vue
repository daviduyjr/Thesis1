/* eslint-disable */
<template>
  <div class="row">
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
  </div>
</template>

<script>
/* eslint-disable */
import JQuery from "jquery";

let $ = JQuery;
export default {
  name: "discountModal",
  props: ["type"],
  data() {
    return {
      customers: [],
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
    }
  },
  methods: {
    async checkType() {
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
    }
  }
};
</script>

<style scoped></style>
