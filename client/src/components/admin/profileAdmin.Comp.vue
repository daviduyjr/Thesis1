<template>
  <section class="register">
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card" v-if="user">
          <div class="card-body">
            <h2 class="card-title text-center">Profile</h2>
            <ul class="list group">
              <li class="list-group-item">
                Email :<strong> {{ user.email }}</strong>
              </li>
              <li class="list-group-item">
                Role :<strong> {{ user.role }}</strong>
              </li>
              <li class="list-group-item">
                Name :<strong> {{ user.name }}</strong>
              </li>
              <li class="list-group-item">
                Contact :<strong> {{ user.contact_number }}</strong>
              </li>
              <li class="list-group-item">
                Address :<strong> {{ user.address }}</strong>
              </li>
            </ul>
            <button class="btn btn-primary btn-lg">Edit</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="js">
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'profileAdmin',
  computed: mapGetters(['user']),
  methods: {
    ...mapActions(['profile'])
  },
  created () {
    this.profile()
  }
  // },
  // mounted (): {
  //   this.profile()
  // }
}
</script>

<style scoped>
.card-title {
  font-size: 35px;
  color: black;
}
</style>
