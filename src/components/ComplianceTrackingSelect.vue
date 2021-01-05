<template>
    <div id="complianceTrackingSelect">
        <div class="form-check form-check-inline" v-bind:key="item.year" v-for="item in yearsList" @change="selectionChange($event)"> 
            <input class="form-check-input" type="checkbox" :id="'inlineCheckbox'+item.year" :value="item" v-model="selectedYears" >
            <label class="form-check-label" :for="'inlineCheckbox'+item.year">{{item.year}}</label>
        </div>
    </div>
</template>

<script>


    export default {
        name: "ComplianceTrackingSelect",
        components: {
            
        },
        data() {
            return {
                selectedYears : []
            }
        },
        props: ["yearsList"],
        watch: {
            yearsList: {
                deep : true,
                handler: function(){
                    this.selectedYears = [this.yearsList.find( y => y.select == true)]
                } 
            }
        },
        computed:{
        },
        methods :{
            selectionChange(){
                console.log("yo")
                this.$emit('selectionChange', this.selectedYears.map(d=>d.year))
            }
        },
        mounted: function(){
            
        }
    }
</script>
<style scoped>

</style>