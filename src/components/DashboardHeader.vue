<template>
   <header class="my-4 p-2">
        <label for="annee">Dashboard Année</label>
        <span id="select-year" class="dropdown show ">
            <a class="btn dropdown-toggle bg-white rounded shadow-sm" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {{selectedYear}}            
            </a>

            <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <a class="dropdown-item" href="#" :key="item.year" v-for="item in yearsList" @click="select(item)">{{item.year}}</a>    
            </div>
        </span>

   </header>
</template>

<script>

export default {
    name: "DashboardHeader",
    components: {

    },
    props: ["currentYear","yearsList"],
    watch:{
        currentYear:{
            deep : true,
            handler : function (){
                this.selectedYear = this.currentYear
            }
        }
    },
    data() {
        return {
            selectedYear: this.currentYear
        };
    },
    computed:{
      
    },
    methods :{
        select(item){
            this.selectedYear = item.year
            this.$emit("selectChange", this.selectedYear)
        }
    },
    mounted: function(){
        
    }
}
</script>

<style scoped>
    header {
        text-align: left;
    }

    label, span {
        margin: 0;
        font-size: 1.5em;
    }

    span{
        margin-left: 0.5em;
    }


</style>