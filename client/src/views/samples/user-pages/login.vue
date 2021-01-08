<template>
  <section class="login">
    <div class="container-scroller">
      <div class="container-fluid page-body-wrapper full-page-wrapper">
        <div
          class="content-wrapper d-flex align-items-center auth auth-bg-1 theme-one"
        >
          <div class="row w-100">
            <div class="col-lg-4 mx-auto">
              <div class="auto-form-wrapper">
                <form @submit.prevent="loginUser" action="#">
                  <div class="alert alert-danger" v-if="error">
                    {{ error }}
                  </div>
                  <div class="form-group">
                    <label class="label">Username</label>
                    <div class="input-group">
                      <input
                        type="text"
                        class="form-control"
                        v-model="username"
                        placeholder="Username"
                      />
                      <div class="input-group-append">
                        <span class="input-group-text">
                          <i class="mdi mdi-check-circle-outline"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="label">Password</label>
                    <div class="input-group">
                      <input
                        type="password"
                        class="form-control"
                        v-model="password"
                        placeholder="*********"
                      />
                      <div class="input-group-append">
                        <span class="input-group-text">
                          <i class="mdi mdi-check-circle-outline"></i>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <button
                      type="submit"
                      class="btn btn-primary submit-btn btn-block"
                    >
                      Login
                    </button>
                  </div>
                  <!-- <div class="form-group d-flex justify-content-between">
                    <div class="form-check form-check-flat mt-0">
                      <label class="form-check-label">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          checked
                        />
                        Keep me signed in
                      </label>
                    </div>
                    <a href="#" class="text-small forgot-password text-black"
                      >Forgot Password</a
                    >
                  </div> -->
                  <!-- <div class="form-group">
                    <button class="btn btn-block g-login">
                      <img
                        class="mr-3"
                        src="../../../assets/images/file-icons/icon-google.svg"
                        alt=""
                      />Log in with Google
                    </button>
                  </div> -->
                  <!-- <div class="text-block text-center my-3">
                    <span class="text-small font-weight-semibold"
                      >Not a member ?</span
                    >
                    <a href="register.html" class="text-black text-small"
                      >Create new account</a
                    >
                  </div> -->
                </form>
              </div>
              <ul class="auth-footer">
                <!-- <li>
                  <a href="#">Conditions</a>
                </li>
                <li>
                  <a href="#">Help</a>
                </li>
                <li>
                  <a href="#">Terms</a>
                </li> -->
              </ul>
              <p class="footer-text text-center">
                copyright © 2020 GENERICA PHARMA. All rights reserved.
              </p>
            </div>
          </div>
        </div>
        <!-- content-wrapper ends -->
      </div>
      <!-- page-body-wrapper ends -->
    </div>
  </section>
</template>

<script lang="js">
/* eslint-disable */
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(['login']),
    loginUser(){
      let user = {
        username: this.username,
        password: this.password
      }
      this.login(user)
      .then(res =>{
        if(res.data.success){
          if (res.data.user.role === 'admin') {
            return this.$router.push('/')
          } else if (res.data.user.role === 'supervisor') {
            return this.$router.push('/SV')
          } else {
            return this.$router.push('/user')
          }
        }
      })
      .catch(err =>{
        console.log(err);
      });
    }
  },
  props: ['msg'],
  computed: {
    ...mapGetters(['error'])
  }
}
</script>

<style scoped lang="scss">
.alert {
  border-radius: 0px;
}
.alert-danger {
  background-color: red;
  color: #ffff;
}
</style>
