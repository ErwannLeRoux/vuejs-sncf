<template>
    <div id="complianceTrackingSelect">
        <div class="form-check form-check-inline" v-bind:key="item.year" v-for="item in yearsList">
            <input class="form-check-input" type="checkbox" :id="'inlineCheckbox'+item" :value="item.year" v-model="selectedYears" @change="selectionChange($event)">
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
                    this.selectedYears = [this.yearsList.find( y => y.select == true).year]
                } 
            }
        },
        computed:{
        },
        methods :{
            selectionChange(event){
                event.preventDefault()
                this.$emit('selectionChange', this.selectedYears)
            }
        },
        mounted: function(){
            
        }
    }
</script>
<style scoped>

</style>