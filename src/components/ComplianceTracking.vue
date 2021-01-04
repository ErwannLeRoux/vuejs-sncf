<template>
    <div class="container-fluid rounded shadow-sm bg-white my-2 py-4 px-2" id="complianceTracking">
        <ComplianceTrackingSelect :years-list="yearsList" @selectionChange="selectionChange"></ComplianceTrackingSelect>
        <ComplianceTrackingChart  :data-years="graphData" :good-threshold="95" :bad-threshold="90" @legendChange="actualizeLegendData" /> 
        <ComplianceTrackingLegend :lines="legendData" /> 
    </div>    
</template>

<script>
    import ComplianceTrackingChart from './ComplianceTrackingChart'
    import ComplianceTrackingLegend from './ComplianceTrackingLegend'
    import ComplianceTrackingSelect from './ComplianceTrackingSelect'

    export default {
        name: "ComplianceTracking",
        components: {
            ComplianceTrackingChart,
            ComplianceTrackingLegend,
            ComplianceTrackingSelect,
        },
        data() {
            return {
                goodTreshold: 95,
                badTreshold: 90,
                graphData: [],
                legendData: []
            };
        },
        props: ["dataYears", "yearsList"],
        watch : {
            dataYears: {
                deep : true,
                handler: function(){
                    this.graphData = this.initializeGraph()
                } 
            },
            yearsList : {
                deep : true,
                handler: function(){
                    let selection = []
                    this.yearsList.forEach((y) => {
                        if(y.select){
                            selection.push(y.year)
                        }
                    })
                    this.actualizeGraphData(selection)
                } 
            }
        },
        computed:{
            
        },
        methods :{
            selectionChange(selections){
                this.actualizeGraphData(selections)
            },
            initializeGraph(){
                let res = []
                this.dataYears.forEach((y) => {
                    let selectedYear = this.yearsList.find(d => d.select == true)
                    res.push({
                        year: y.year,
                        values : y.data,
                        display : (selectedYear.year == y.year)
                    })
                })
                return res
            },
            actualizeGraphData(selections){
                this.graphData.forEach((y) => {
                    let select = (selections.find(d => (d == y.year)) != undefined)
                    y.display = select
                })
            },
            actualizeLegendData(newLegendData){
                this.legendData = newLegendData
            }
        },
        mounted: function(){
            
        }
    }
</script>
<style scoped>
    #complianceTracking{
        color:#2c3e50;
    }
</style>



