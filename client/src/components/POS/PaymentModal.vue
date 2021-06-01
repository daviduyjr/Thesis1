<template>
  <section>
    <div class="wrapper">
      <div class="row">
        <div class="col-12 borderStyle">
          <b-form-group class="mb-1 mt-1" v-slot="{ ariaDescribedBy }">
            <b-form-radio-group
              @change="radioChange"
              v-model="radioSelected"
              :options="radioOptions"
              :aria-describedby="ariaDescribedBy"
              name="radioDiscount"
            ></b-form-radio-group>
          </b-form-group>
        </div>
        <div class="col-12" id="inputCustomer">
          <div class="row">
            <div class="col-7">
              <b-form-group
                label="Filter By: "
                label-cols-sm="4"
                class="mb-1 mt-1"
              >
                <v-select
                  label="name"
                  :options="customers"
                  :value="$store.myValue"
                  @input="setSelected"
                  class="style-chooser"
                ></v-select>
                <!-- <b-form-radio-group
                  class="pt-2"
                  v-model="filterBy"
                  :options="filterdByOptions"
                  :aria-describedby="ariaDescribedBy"
                  name="filterByRadio"
                ></b-form-radio-group> -->
              </b-form-group>
            </div>
            <div class="form-group">
              <b-form-group class="mb-1 mt-1" v-slot="{ ariaDescribedBy }">
                <b-form-radio-group
                  class="pt-2"
                  v-model="filterBy"
                  :options="filterdByOptions"
                  :aria-describedby="ariaDescribedBy"
                  name="filterByRadio"
                ></b-form-radio-group
              ></b-form-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions } from "vuex";
import JQuery from "jquery";
let $ = JQuery;
export default {
  name: "paymentModal",
  components: {},
  data() {
    return {
      radioSelected: "none",
      filterBy: "name",
      radioOptions: [
        { text: "None", value: "none" },
        { text: "Senior", value: "senior" },
        { text: "PWD", value: "PWD" }
      ],
      filterdByOptions: [
        { text: "ID", value: "id_no" },
        { text: "Name", value: "full_name" }
      ],
      customers: []
    };
  },
  mounted() {
    $("#inputCustomer").hide();
  },
  computed: {
    customerListState() {
      return this.$store.state.Customer.customerList;
    }
  },
  methods: {
    ...mapActions(["filtercustomerList"]),
    setSelected(value) {
      //  trigger a mutation, or dispatch an action
      //console.log(value);
    },
    async radioChange() {
      if (this.radioSelected == "senior" || this.radioSelected == "PWD") {
        this.customerFiltered(this.radioSelected);
        $("#inputCustomer").show();
      }
      if (this.radioSelected == "none") {
        this.filtercustomerList(this.radioSelected);
        $("#inputCustomer").hide();
      }
    },
    async customerFiltered(type) {
      const res = await this.customerListState.filter(
        data => data.type == type
      );
      this.customers = [];
      res.forEach(data => {
        this.customers.push({
          id: data.id_no,
          name: data.full_name
        });
      });
    }
  }
};
</script>

<style scoped>
.borderStyle {
  border: 1px solid #0000ff;
  border-radius: 10px 10px;
}
.style-chooser .vs__search::placeholder,
.style-chooser .vs__dropdown-toggle,
.style-chooser .vs__dropdown-menu {
  background: #dfe5fb;
  border: none;
  color: red;
  text-transform: uppercase;
  font-variant: small-caps;
}
</style>
