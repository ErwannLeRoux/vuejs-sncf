<template>
    <h2>Detail Page {{ $route.params.id }}</h2>
</template>

<script>
export default {
    name: "Dashboard",
    components: {

    },
    props: [
        "query"
    ],
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
