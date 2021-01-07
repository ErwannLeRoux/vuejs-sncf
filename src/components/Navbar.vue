<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
  <a class="navbar-brand" href="/">
    <img src="./../assets/images/satisfaction.png" width="60" class="d-inline-block align-top" alt="" />
  </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <a class="nav-link" v-bind:class="{active: item.location == currentLocation}" :key="item.id" v-bind:href="item.location" v-for="item in list_items" @click="makeActive(item, list_items)">
          {{ item.label }}
        </a>
      </div>
    </div>
  </nav>

</template>

<script>
export default {
    name: "Navbar",
    components: {

    },
    props: [
        "currentLocation"
    ],
    data() {
        return {
        list_items : [
        {
          id : 1,
          label : "Accueil",
          location : "/",
        },
        {
          id : 2,
          label : "Dashboard",
          location : "/dashboard",
        },
        {
          id : 3,
          label : "Liste des gares",
          location : "/gares",
        },
        {
          id : 4,
          label : "Carte",
          location : "/map",
        }
      ]
        };
    },
    methods :{

    },
}

</script>

<style scoped>
    nav {
        background-color: whitesmoke;
        box-shadow: 2px 2px 2px grey;
    }
</style>
