<template>
  <main id="app" class="">
    <Navbar :current-location="this.$route.path" />
    <router-view />
  </main>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar,
  },
  data() {
    return {
    }
  }
}
</script>

<style>

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    padding-bottom: 30px;
    background: linear-gradient(#822171, #DF1C26);
    min-height: 100vh;
  }

  body, html {   min-height: 100%; }

</style>
