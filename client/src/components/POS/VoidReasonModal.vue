<template>
  <div class="row">
    <div class="col-12  mb-1">
      <b-form-group class="mb-1 mt-1" v-slot="{ ariaDescribedBy }">
        <small class="">Discount</small>
        <b-form-radio-group
          @change="radioVoidChange"
          v-model="radioVoidSelected"
          :options="radioOptions"
          :aria-describedby="ariaDescribedBy"
          name="radioDiscount"
        ></b-form-radio-group>
      </b-form-group>
    </div>
    <div class="col-12">
      <b-button
        @click="cancelVoid"
        class="btn-block mt-1"
        pill
        variant="outline-warning"
        >Cancel</b-button
      >
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "voidReasonModal",
  data() {
    return {
      radioVoidSelected: "",
      radioOptions: [
        { text: "Change order", value: "Change order" },
        { text: "Wrong item", value: "Wrong item" },
        { text: "Cancelled", value: "Cancelled" }
      ]
    };
  },
  methods: {
    radioVoidChange() {
      const reason = this.radioVoidChange;

      this.$emit("voidReason", this.radioVoidSelected);
    },
    cancelVoid() {
      this.$emit("cancelVoid");
    }
  }
};
</script>

<style scoped></style>
