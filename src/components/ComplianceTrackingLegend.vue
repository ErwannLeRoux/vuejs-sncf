<template>
    <div id="complianceTrackingLegend">
        <div class="d-flex justify-content-center">
            <span class="legend-item-line p-2" :key="line.color" v-for="line in lines">
                <svg class="legend-item-svg" width="3rem" height="1em">
                    <line class='line-legend' x1="0em" y1="0.5em" x2="2.5em" y2="0.5em" :style="'stroke:'+line.color+'; stroke-width: 2;'"></line>    
                </svg>
                {{line.label}}
            </span>
        </div>
        <div class="d-flex justify-content-center">
            <span class="legend-item-area p-2" :key="area.color" v-for="area in areas">
                <svg class="legend-item-svg" width="1em" height="1em">
                    <circle class='area-legend' cx="0.5em" cy="0.5em" r="0.5em" :style="'fill:'+ area.color+'; stroke: black; stroke-width: 1;'"></circle>    
                </svg>
                {{area.label}}
            </span>
        </div>
    </div>
</template>

<script>


    export default {
        name: "ComplianceTrackingLegend",
        components: {
            
        },
        data() {
            return {
                areas : [
                    {
                        color: "green",
                        label: "Taux de conformités correctes"
                    },
                    {
                        color: "orange",
                        label: "Taux de conformités passables"        
                    },
                    {
                        color : "red",
                        label: "Taux de conformités rejetés",
                    },
                ],
            }  
        },
        props: ["lines"],
        computed:{
        
        },
        methods :{ 
        
        },
        mounted: function(){
        }
    }
</script>
<style scoped>
    .area-legend{
        opacity : 0.3;
    }
    #complianceTrackingLegend{
        text-align: left;
    }

</style>



