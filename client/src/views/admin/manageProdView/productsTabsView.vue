<template>
  <section class="register">
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center">Manage Records</h2>
            <div>
              <b-tabs content-class="mt-3" justified lazy>
                <b-tab title="Products">
                  <ProductsTab />
                </b-tab>
                <b-tab title="CATEGORIES" active>
                  <CategoriesComp />
                </b-tab>
                <b-tab title="DISTRIBUTORS">
                  <DistributorsComponent />
                </b-tab>
              </b-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import CategoriesComp from "@/components/admin/manageProducts/CategoriesComp";
import DistributorsComponent from "@/components/admin/manageProducts/DistributorsComp";
import ProductsTab from "@/components/admin/manageProducts/ProductsTab";

export default {
  name: "productsTabsView",
  components: {
    CategoriesComp,
    DistributorsComponent,
    ProductsTab
  }
};
</script>

<style scoped>
.card-title {
  font-size: 27px;
}
</style>
