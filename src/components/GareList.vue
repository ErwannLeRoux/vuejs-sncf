<template>
    <table class="table" id='table'>
        <thead>
        <tr>
            <th scope="col">Code_uic</th>
            <th scope="col">Libellé</th>
            <th scope="col">Commune</th>
            <th scope="col">Département</th>
            <th scope="col"><a class="tip" data-toggle="tooltip" title="Taux de conformité obtenu en %">Score </a></th>
            <th scope="col"><a class="tip" data-toggle="tooltip" title="Différence avec l'année précédente">Tendance annuelle</a></th>
        </tr>
        </thead>
        <tbody>

        </tbody>
    </table>
</template>


<script>
    export default {
        name: "GareList"
    }
</script>

<style scoped>

</style>
