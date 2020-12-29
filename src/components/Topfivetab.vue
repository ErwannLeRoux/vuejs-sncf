<template>
    <div id="container" class="my-4 p-3 rounded shadow-sm ">        
        <div class="border-bottom pb-2" id="header">
            <svg id="trend-rect" width="30" height="30" v-bind:fill="info.color">
                <rect x="0" y="0" rx="5" ry="5" width="30" height="30" style="opacity:0.5"/>
            </svg>
            <h6 id="title">{{info.title}}</h6>
        </div>
        <table class="table" id='table'>
            <thead>
                <tr>
                    <th scope="col">Code_uic</th>
                    <th scope="col">Libellé</th>
                    <th scope="col">Commune</th>
                    <th scope="col">Département</th>
                    <th scope="col">Score</th>
                </tr>
            </thead>
            <tbody>
                <tr :key="station.fields.code_uic" v-for="station in stationsList" @click="redirectDetail(station.fields.code_uic)">
                    <td>{{ station.fields.code_uic }}</td>
                    <td>{{ station.fields.libelle }}</td>
                    <td>{{ station.fields.commune}}</td>
                    <td>{{ station.fields.departemen}}</td>
                    <td>6</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: "Topfivetab",
    components: {

    },
    data() {
        return {
            color : "red"
        };
    },
    methods :{
        redirectDetail(code_uic){
            this.$router.push({ path: `/detail/${code_uic}` })
        }
    },
    props: [
        "info",
        "stationsList"
    ],
}
</script>

<style scoped>
    #container{
        text-align: left;
        background-color: white ;
    }
    #header{
        display: grid ;
        grid-template-columns: 60px 1fr;
    }
    #title{
        margin:0;
        padding-top:0.5em;
        text-align: inherit;
    }
    #table{
        margin-bottom: 0;
        font-size: 0.5em;
    }
    table tbody tr:hover {
        background-color: lightgray;
        cursor: pointer;
    }

</style>