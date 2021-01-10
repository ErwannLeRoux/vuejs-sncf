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
                    <circle class='area-legend' cx="0.5em" cy="0.5em" r="0.5em" :style="'fill:'+ area.color"></circle>
                </svg>
                 <a class="tip" data-toggle="tooltip" :title="area.tip">{{area.label}}</a>
            </span>
        </div>
    </div>
</template>

<script>
    import jQuery from "jquery";
    const $ = jQuery;
    window.$ = $;

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    export default {
        name: "ComplianceTrackingLegend",
        components: {

        },
        data() {
            return {
                areas : [
                    {
                        color: "green",
                        label: "Taux de conformités excellents",
                        tip: "Taux supérieur égal à 95%"
                    },
                    {
                        color: "orange",
                        label: "Taux de conformités passables",
                        tip: "Taux compris entre 90 et 95%"
                    },
                    {
                        color : "red",
                        label: "Taux de conformités mauvais",
                        tip: "Taux inférieur à 90%"
                    },
                ],
            }
        },
        props: ["lines"],
        watch:{
            line(){
                $(function () {
                    $('[data-toggle="tooltip"]').tooltip()
                })
            }
        },
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
        opacity : 0.5;
    }
    .tip{
        text-decoration: underline;
        color: inherit;
        cursor:pointer;
    }
</style>



