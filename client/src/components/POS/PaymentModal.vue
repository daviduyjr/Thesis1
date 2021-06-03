<template>
  <section>
    <div class="wrapper">
      <div class="row">
        <div class="col-12 borderStyle mb-1">
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
            <div class="col-6">
              <small class="text-muted">ID No.</small>
              <v-select
                label="id_no"
                :options="selectIDNo"
                :value="$store.myValue"
                @input="setSelected"
                class="style-chooser"
              ></v-select>
            </div>
            <div class="col-6">
              <small class="text-muted">Name</small>
              <v-select
                label="full_name"
                :options="selectFullName"
                :value="$store.myValue"
                @input="setSelected"
                class="style-chooser"
              ></v-select>
            </div>
          </div>
        </div>
        <div class="col-12 mt-2">
          <b-button class="btn-block" pill variant="outline-primary"
            >Save</b-button
          >
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
      radioOptions: [
        { text: "None", value: "none" },
        { text: "Senior", value: "senior" },
        { text: "PWD", value: "PWD" }
      ],
      selectFullName: [],
      selectIDNo: []
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
      console.log(value);
    },
    async radioChange() {
      if (this.radioSelected == "senior" || this.radioSelected == "PWD") {
        this.customerFilteredFullName(this.radioSelected);
        this.customerFilteredIDNo(this.radioSelected);
        $("#inputCustomer").show();
      }
      if (this.radioSelected == "none") {
        this.filtercustomerList(this.radioSelected);
        $("#inputCustomer").hide();
      }
    },
    async customerFilteredFullName(type) {
      const res = await this.customerListState.filter(
        data => data.type == type
      );
      this.selectFullName = [];
      res.forEach(data => {
        this.selectFullName.push({
          id_no: data.id_no,
          full_name: data.full_name
        });
      });
    },
    async customerFilteredIDNo(type) {
      const res = await this.customerListState.filter(
        data => data.type == type
      );
      this.selectIDNo = [];
      res.forEach(data => {
        this.selectIDNo.push({
          id_no: data.id_no,
          full_name: data.full_name
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
