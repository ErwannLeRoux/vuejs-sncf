<template>
   <header class="container-fluid">
        <h1 id="title">{{title}}</h1>
        <h3 id="subtitle" v-if="subtitle">{{subtitle}}</h3>
        <div v-if="!displaySelect" id="select-year" class="dropdown show ">
            <a class="btn dropdown-toggle bg-white rounded shadow-sm" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {{selectedYear}}            
            </a>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <a class="dropdown-item" href="#" :key="item.year" v-for="item in yearsList" @click="select(item)">{{item.year}}</a>    
            </div>
        </div>
        
   </header>
</template>

<script>

export default {
    name: "HeaderWithSelectYear",
    components: {

    },
    props: ["currentYear","yearsList","title","subtitle"],
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
        displaySelect(){
            return this.yearsList.length == 0
        } 
      
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
        margin-bottom: 4em ;
        margin-top: 2em;
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

    #title {
        display: inline-block;
    }
    #title, #subtitle{
        color: white;
    }

    @media screen and (max-width: 1000px) {
        #title, #subtitle{
            text-align: center;
            display: block;
        }

        #select-year{
            display: block;
            text-align: center;
        }
    }
</style>