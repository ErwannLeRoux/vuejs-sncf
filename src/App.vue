<template>
  <div id="app">
    <Navbar :current-location="this.$route.path" />
    <router-view />
  </div>

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
  color: #2c3e50;
  background: linear-gradient(#822171, #DF1C26);
  height: 100%;
}

html, body {
  width: 100vw;
  height: 100vh;
}
</style>
