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
  background: linear-gradient(#822171, #DF1C26);
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: linear-gradient(#822171, #DF1C26);
  height: 100%;
}

html, body {
  width: 100vw;
  height: 100vh;
}

</style>
