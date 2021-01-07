<template>
    <div class="bg-white rounded shadow-sm" id="main">
        <h2 id="title">Bienvenue sur SNCF Conformité !</h2>

        <p>
            La <b>propreté des gares</b> est un enjeu fort pour <b>la SNCF</b>.
            En vue de satisfaire les clients, la SNCF réalise, conjointement avec le prestataire,
            des <b>contrôles de conformité de la prestation de nettoyage, dont la fréquence varie en fonction de l’importance de la gare</b>.
            Ces contrôles reposent sur la réalisation d’observations dans différentes zones de la gare abord, accès, hall, quais, … et sur différents supports (vitres, sols, signalétique).
        </p>
        <p>
            L’obligation de résultat est fixée à <b>90% de conformité minimum</b>. En deçà, des actions correctives sont déclenchées rapidement
            et s’inscrivent dans une démarche d’amélioration continue.        
        </p>

        <p>
            Cette application à donc vocation à <b>surveiller la conformité des gares de la SNCF</b> par rapport aux différents audits/contrôles qui ont été réalisés.
            Dans cette optique nous proposons :
        </p>

        <ul>
            <li>un  <router-link to="/dashboard">dashbord</router-link> permettant de visualiser l'état général de la SNCF sur une année donnée.</li>
            <li>une <router-link to="/map">map</router-link> permettant de rechercher sur toute la France une gare spécifique.</li>
            <li>une <router-link to="/gares">interface de recherche tabulaire</router-link>, qui de même permet de rechercher une gare spécifique.</li>
            <li>pour chaque gare une page de détail permettant de visualiser le taux de conformité et les différents audits qui y ont été réalisés.</li>
        </ul>
    </div>
</template>

<script>


export default {
    name: "Accueil",
    components: {
    },
    data() {
        return {
        };
    },
    methods :{

    },
}
</script>

<style scoped>
    #main{
        width:75%;
        margin:auto;
        margin-top:3vw;
        padding:2vw;
        text-align:justify;
    }

    #main #title{
        color: #8F2168;
        margin-bottom: 2vw;
        text-align: center;
    }

    #main p{
        color: #2c3e50;
    }
</style>
