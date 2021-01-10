# vuejs-sncf

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Présentation de l'application:

**Objectif de l'application:** 

Notre application "SNCF conformité" a comme objectif de pouvoir suivre les résultats des différents audits de contrôle de propreté opéré 
auprès des gares de de la SNCF. Pour cela nous utilisons les données fournit par l'API suivant :
https://ressources.data.sncf.com/explore/dataset/proprete-en-gare/table/?sort=mois


**Composants et fonctionnalitées:**

Notre application se compose :

1. d'**une page d'accueil** présentant l'application.
2. d'**une bar de navigation** permettant l'accès aux différentes partie de l'application.
3. une **page de dashboard** permettant de suivre l'état globale de la sncf sur la propreté pour différentes années, on trouveras donc au sein de cette page : 
    - un filtre de sélection permettant de choisir l'année pour laquelle on souhaite connaitre les informations.
    -  des informations sur le nombre d'audits réaliser au cours de l'année sélectionnée ( nombre d'audits, qualité des audits ...).
    - le taux de conformité moyen des audits pour l'année sélectionnée.
    - un top 5 des meilleures et des pires gares auditées pour l'année sélectionnée.
    - un graphique de suivi annuel  du taux de conformité moyen fait via d3, pour l'année sélectionnée on peut y voir les variations pour chaque mois de l'année du score moyen obtenues sur l'ensemble des audits réalisés. Nous avons aussi permit de faire une étude comparatives entre plusieurs années en permettant à l'utilisateur d'ajouter dynamiquement la courbe d'une année au graphique.

4. d'**une page map** permettant de visualiser au sein d'une carte intéractives les différentes gares su réseau SNCF. Chaque gare est indiqué par un marqueur correspondant à son état (gris = non auditées, vert = bon résultats sur ses audits, orange = résultats moyens, rouge = résultats mauvais).
Cette carte est accompagnée de divers filtres comme par exemple une sélection du département ou de la région d'appartennance des gares. Si l'utilisateur clique sur le marqueur associée à une gare alors il est rediriger sur sa page de détail.
5. d'**une page listes des gares** qui contient un tableau contenant toute les gares de la SNCF, pour chaque gare sont affichées différentes informations comme le taux de conformité obtenues (score) ou la tendance annuelle qui représente l'évolution du score par rapport à l'année précédente.
Ce tableau est accompagnée de différents filtres de recherches permettant à l'utilisateur de facilement trouver une gare spécifique ou d'affiner sa recherche (en tappant le nom ou le code associée à une gare dans le champs de recherche textuel par exemple).
6. **d'une page de détail** pour chaque gare, cette page permet de visualiser l'état générale de la gare à partir des différents audits opérés. 
On y retrouve des composants similaires à la page de dashboard, nottament le graphique de suivi annuel. 


**Charte graphique de l'application**

Pour le choix des couleurs de notre application nous nous sommes inspirée du logo de la sncf, nous avons donc obté pour un dégradé partant du violet vers un rouge "framboise" comme couleur de font principale et le blanc comme couleur de titres et de zones de contenus.

Pour le logo nous avons choisis le logo de la sncf que nous avons adapté au nom de notre application.

Enfin notre application ayant comme objectif de pouvoir suivre les résultats des différents audits de contrôle de propreté nous avons choisi d'utiliser un code couleur permettant de facilement voir la qualité des résultats obtenues, ainsi la couleur verte est associée à un score "excellent" qui répond fortement au éxigence de la SNCF, le orange à un score "passable" qui répond tout juste au éxigence et le rouge à un score "mauvais" qui n'atteint pas les éxigences de la SNCF.





