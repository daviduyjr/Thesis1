<template>
  <section class="register">
    <div class="row">
      <div class="col-12">
        <ul class="list group">
          <li class="list-group-item">
            Product ID : <strong>{{ product.productId }}</strong>
          </li>
          <li class="list-group-item">
            Product Name :<strong> {{ product.productName }}</strong>
          </li>
          <li class="list-group-item">
            Description :<strong> {{ product.description }}</strong>
          </li>
          <li class="list-group-item">
            Category :<strong> {{ product.category }}</strong>
          </li>
          <li class="list-group-item">
            Unit Price :
            <span>&#x20B1;</span>
            <strong> {{ product.unit_price }}</strong>
          </li>
          <li class="list-group-item">
            Markup Price :
            <span>&#x20B1;</span><strong> {{ product.markup_price }}</strong>
          </li>
          <li class="list-group-item">
            SRP : <span>&#x20B1;</span> <strong>{{ product.srp }}</strong>
          </li>
          <li class="list-group-item">
            Stock on hand : <strong>{{ product.stock_onhand }}</strong>
          </li>
          <li class="list-group-item">
            IsActive : <strong>{{ product.isActive }}</strong>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters, mapState } from "vuex";
import store from "@/store";

export default {
  name: "productDetails",
  props: ["product"],
  data: () => {
    return {
      user: {
        user_id: "",
        email: "",
        role: "",
        name: "",
        contactNumber: "",
        address: "",
        isActive: ""
      }
    };
  },
  computed: {},
  methods: {
    // userProfile2() {
    //   if (this.typeOfMethod === "updateUser") {
    //     product.user_id = this.updatedUser.user_id;
    //     product.email = this.updatedUser.email;
    //     product.role = this.updatedUser.role;
    //     product.name = this.updatedUser.name;
    //     product.contactNumber = this.updatedUser.contact_number;
    //     product.address = this.updatedUser.address;
    //     product.isActive = this.updatedUser.isActive;
    //     return;
    //   }
    //   if (this.typeOfMethod === "addUser") {
    //     product.user_id = this.newUser.user_id;
    //     product.email = this.newUser.email;
    //     product.role = this.newUser.role;
    //     product.name = this.newUser.name;
    //     product.contactNumber = this.newUser.contact_number;
    //     product.address = this.newUser.address;
    //     product.isActive = this.newUser.isActive;
    //     return;
    //   }
    // }
  },
  created() {},

  mounted() {
    //this.userProfile2();
  }
};
</script>
<style scoped>
.card-title {
  font-size: 27px;
}
</style>
