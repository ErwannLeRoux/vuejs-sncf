<template>
   <header class="container-fluid my-4">
        <h2 id="title">{{text}}</h2>
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
    name: "HeaderWithSelectYear",
    components: {

    },
    props: ["currentYear","yearsList","text"],
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
            selectedYear: this.currentYear,
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
        padding:0;
        text-align: left;
    }

    .dropdown-menu a:hover{
        background-color: lightgray;
    }

    label, span {
        margin: 0;
        font-size: 1.5em;
    }

    span{
        margin-left: 0.5em;
    }

    #title{
        display: inline-block;
    }
</style>