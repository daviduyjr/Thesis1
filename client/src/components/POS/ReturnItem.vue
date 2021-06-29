<template>
  <div class="row">
    <div class="col-12">
      <input v-model="id" type="text" />
      <button @click="test">Find</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions } from "vuex";

export default {
  name: "returnItem",
  data() {
    return {
      id: ""
    };
  },
  methods: {
    ...mapActions(["getTransactionById"]),
    test() {
      this.getTransactionById(this.id);
    }
  }
};
</script>

<style scoped></style>
