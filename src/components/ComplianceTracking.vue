<template>
    <div id="complianceTracking">
        <ComplianceTrackingChart :good-threshold="95" :bad-threshold="90" /> 
        <ComplianceTrackingLegend />

    </div>
    
</template>

<script>
    import ComplianceTrackingChart from './ComplianceTrackingChart'
    import ComplianceTrackingLegend from './ComplianceTrackingLegend'

    export default {
        name: "ComplianceTracking",
        components: {
            ComplianceTrackingChart,
            ComplianceTrackingLegend
        },
        data() {
            return {
            };
        },
        props: [],
        computed:{
        
        },
        methods :{ 
        
        },
        mounted: function(){
        }
    }
</script>
<style scoped>
    #complianceTracking{
    
    }


</style>



