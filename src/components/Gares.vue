<template>
    <LeafletMap></LeafletMap>
    <GareList></GareList>
</template>

<script>
import GareList from "./GareList";
import LeafletMap from "./LeafletMap";

export default {
    name: "Dashboard",
    components: {
        LeafletMap,
        GareList
    },
    data() {
        return {
        };
    },
    methods :{

    },
}
</script>

<style scoped>

</style>

