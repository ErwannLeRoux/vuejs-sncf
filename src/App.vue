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
  height: 100%;
  padding-bottom: 30px;
 background: linear-gradient(#822171, #DF1C26);
}

body, html, #app {   min-height: 100%; }

</style>
