<template>
  <div class="row">
    <div class="col-12  mb-1">
      <b-form-group class="mb-1 mt-1" v-slot="{ ariaDescribedBy }">
        <small class="">Discount</small>
        <b-form-radio-group
          @change="radioChange"
          v-model="radioSelected"
          :options="radioOptions"
          :aria-describedby="ariaDescribedBy"
          name="radioDiscount"
        ></b-form-radio-group>
      </b-form-group>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "voidReasonModal",
  data() {
    return {
      radioSelected: "",
      radioOptions: [
        { text: "None", value: "none" },
        { text: "Senior", value: "senior" },
        { text: "PWD", value: "PWD" }
      ]
    };
  },
  methods: {
    radioChange() {}
  }
};
</script>

<style scoped></style>
