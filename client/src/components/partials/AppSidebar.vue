<template>
  <section class="app-sidebar">
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
      <ul class="nav" v-if="user">
        <li class="nav-item nav-profile">
          <a href="#" class="nav-link">
            <div class="profile-image">
              <img
                class="img-xs rounded-circle"
                src="../../assets/images/faces/face8.jpg"
                alt="profile image"
              />
              <div class="dot-indicator bg-success"></div>
            </div>
            <div class="text-wrapper" v-if="user">
              <p class="profile-name">{{ user.name }}</p>
              <p class="designation">{{ user.role }}</p>
            </div>
          </a>
        </li>
        <li class="nav-item nav-category">Main Menu</li>
        <!-- Para sa admin to -->
        <li class="nav-item">
          <a class="nav-link" v-b-toggle="'dashboard-dropdown'">
            <i class="menu-icon typcn typcn-document-text"></i>
            <span class="menu-title">Dashboard</span>
            <i class="menu-arrow"></i>
          </a>
          <b-collapse id="dashboard-dropdown">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/">Dashboard 1</router-link>
              </li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item" v-if="isAdmin">
          <a class="nav-link" v-b-toggle="'admin'">
            <i class="menu-icon typcn typcn-document-add"></i>
            <span class="menu-title">User Pages</span>
            <i class="menu-arrow"></i>
          </a>
          <b-collapse id="admin" v-if="user">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/profile"
                  >Profile</router-link
                >
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/usersList"
                  >Users List</router-link
                >
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/addUser/"
                  >Add User</router-link
                >
              </li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item" v-if="isAdmin">
          <a class="nav-link" v-b-toggle="'product'">
            <i class="menu-icon typcn typcn-document-add"></i>
            <span class="menu-title">Product</span>
            <i class="menu-arrow"></i>
          </a>
          <b-collapse id="product" v-if="user">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/categories"
                  >Categories</router-link
                >
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/productsTab"
                  >Tabs</router-link
                >
              </li>
            </ul>
          </b-collapse>
        </li>
        <!-- Para sa Supervisor to -->
        <li class="nav-item" v-if="isSupervisor">
          <a class="nav-link" v-b-toggle="'SV'">
            <i class="menu-icon typcn typcn-document-add"></i>
            <span class="menu-title">User Pages</span>
            <i class="menu-arrow"></i>
          </a>
          <b-collapse id="SV" v-if="user">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/userProfile"
                  >User Profile</router-link
                >
              </li>
            </ul>
          </b-collapse>
        </li>
        <!-- Para sa User to -->
        <li class="nav-item" v-if="isUser">
          <a class="nav-link" v-b-toggle="'user'">
            <i class="menu-icon typcn typcn-document-add"></i>
            <span class="menu-title">User Pages</span>
            <i class="menu-arrow"></i>
          </a>
          <b-collapse id="user">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/userProfile"
                  >User Profile</router-link
                >
              </li>
              <!-- <li class="nav-item">
                <router-link class="nav-link" to="/buttons"
                  >Buttons</router-link
                >
              </li> -->
            </ul>
          </b-collapse>
        </li>
      </ul>
    </nav>
  </section>
</template>

<script lang="js">
import JQuery from 'jquery'
import { mapActions, mapGetters } from 'vuex'
// eslint-disable-next-line
let $ = JQuery
export default {
  name: 'app-sidebar',
  mounted () {
    const body = document.querySelector('body')
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    document.querySelectorAll('.sidebar .nav-item').forEach(function (el) {
      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open')
        }
      })
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open')
        }
      })
    })
  },
  computed: {
    ...mapGetters([
      'user',
      'isUser',
      'isSupervisor',
      'isAdmin'
    ])
  },
  methods: {
    ...mapActions(['profile'])
  },
  created () {
    this.profile()
  }

}
</script>

<style scoped lang="scss">
// .app-sidebar {
// }
</style>
