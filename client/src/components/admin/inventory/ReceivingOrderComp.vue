<template>
  <section>
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center">
              Receiving Order
            </h2>
            <b-table-simple hover small caption-top stacked>
              <b-thead head-variant="dark">
                <b-tr>
                  <b-th>RO_Code</b-th>
                  <b-th>Date Received</b-th>
                  <b-th>No. of Items</b-th>
                  <b-th>Actions</b-th>
                </b-tr>
              </b-thead>
              <b-tbody>
                <b-tr></b-tr>
              </b-tbody>
            </b-table-simple>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions } from "vuex";
export default {
  name: "receivingOrderComp",
  data() {
    return {
      ROList: []
    };
  },
  mounted() {
    this.getROList();
  },
  methods: {
    ...mapActions(["getReceivingOrderList"]),
    async getROList() {
      const res = await this.getReceivingOrderList();

      if (res.success == true) {
        res.result.forEach(data => {
          this.ROList.push(data);
        });
      }
      this.ROList.forEach(data => {});
    }
  }
};
</script>

<style scoped>
.card-title {
  font-size: 27px;
}
</style>
