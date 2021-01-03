<template>
    <div id="complianceTracking"> 
        <h2>Suivi du taux de conformité de la SNCF à l'année</h2>
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
        props: ["dataYears", "currentYear"],
        watch : {
            dataYears: {
                deep : true,
                handler: function(){
                    this.graphData = this.initializeGraphData()
                } 
            }
        },
        computed:{
            yearsList() {
                let res = []
                this.dataYears.forEach((y) => {
                    if(y.year == this.currentYear){
                        res.push(
                            {
                                year : y.year,
                                select : true
                            }
                        )
                    }else{
                        res.push(
                            {
                                year : y.year,
                                select : false
                            }
                        )
                    }
                })
                res.sort((a,b)=>{
                    return parseInt(a.year)-parseInt(b.year)
                })
                return res
            },
        },
        methods :{
            selectionChange(selections){
                this.actualizeGraphData(selections)
            },
            initializeGraphData(){
                let res = []
                this.dataYears.forEach((y) => {
                    res.push({
                        year: y.year,
                        values : y.data,
                        display : (this.currentYear == y.year)
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

</style>



