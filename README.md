# SNCF Conformité - VueJS:

### Présentation de l'application:

**Objectif de l'application:** 

Notre application "SNCF conformité" a comme objectif de pouvoir suivre les résultats des différents audits de contrôle de propreté opérés 
auprès des gares de de la SNCF. Pour cela nous utilisons les données fournies par l'API suivant :
https://ressources.data.sncf.com/explore/dataset/proprete-en-gare/table/


**Composants et fonctionnalitées:**

Notre application se compose de :

1. Une **page d'accueil** présentant l'application.
2. Une **barre de navigation** permettant l'accès aux différentes partie de l'application.
3. Une **page de dashboard** permettant de suivre l'état global de la sncf sur la propreté pour différentes années, on trouvera donc au sein de cette page : 
    - un filtre de sélection permettant de choisir l'année pour laquelle on souhaite connaitre les informations.
    -  des informations sur le nombre d'audits réalisés au cours de l'année sélectionnée ( nombre d'audits, qualité des audits ...).
    - le taux de conformité moyen des audits pour l'année sélectionnée.
    - un top 5 des meilleures et des pires gares auditées pour l'année sélectionnée.
    - un graphique de suivi annuel  du taux de conformité moyen fait via d3, pour l'année sélectionnée on peut y voir les variations pour chaque mois de l'année du score moyen obtenu sur l'ensemble des audits réalisés. Nous avons aussi permis de faire une étude comparative entre plusieurs années en permettant à l'utilisateur d'ajouter dynamiquement la courbe d'une année au graphique.

4. Une **page map** permettant de visualiser au sein d'une carte intéractive les différentes gares du réseau SNCF. Chaque gare est indiquée par un marqueur correspondant à son état. Cette carte est accompagnée de divers filtres comme par exemple une sélection du département ou de la région d'appartenance. Si l'utilisateur clique sur le marqueur associé à une gare alors il est redirigé sur sa page de détail.
5. Une **page liste des gares** qui contient un tableau contenant toutes les gares de la SNCF, pour chaque gare, sont affichées différentes informations comme le taux de conformité obtenu (score) ou la tendance annuelle qui représente l'évolution du score par rapport à l'année précédente.
Ce tableau est accompagné de différents filtres de recherche permettant à l'utilisateur de facilement trouver une gare spécifique ou d'affiner sa recherche (en tappant le nom ou le code associé à une gare dans le champs de recherche textuel par exemple). Comme pour la map, un clique sur un élément du tableau redirige vers la page de détail de la gare associée.
6. Une **page de détail** pour chaque gare, cette page permet de visualiser l'état général de la gare à partir des différents audits opérés. 
On y retrouve des composants similaires à la page de dashboard, nottament le graphique de suivi annuel. 


**Charte graphique de l'application:**

Pour le choix des couleurs de notre application nous nous sommes inspirés du logo de la sncf, nous avons donc opté pour un dégradé partant du violet vers un rouge "framboise" comme couleur de font principale et le blanc comme couleur de titres et de zones de contenu.

Pour le logo nous avons choisi le logo de la sncf que nous avons adapté au nom de notre application.

Enfin notre application ayant comme objectif de pouvoir suivre les résultats des différents audits de contrôle de propreté nous avons choisi d'utiliser un code couleur permettant de facilement voir la qualité des résultats obtenus, ainsi la couleur verte est associée à un score "excellent" qui répond fortement au éxigences de la SNCF, le orange à un score "passable" qui répond tout juste au éxigence et le rouge à un score "mauvais" qui n'atteint pas les éxigences de la SNCF.

### Librairies utilisées 

Vuex - https://vuex.vuejs.org/

Vue Router - https://router.vuejs.org/

Bootstrap - https://getbootstrap.com/

JQuery- https://jquery.com/

Leaflet- https://leafletjs.com/

D3js - https://d3js.org/

### Deploiement
Les services à mettre en place pour le bon fonctionnement de notre application : 

1. Une base de données mongoDB
2. Une application express
3. Un serveur nginx qui expose notre application VueJS principale

### MongoDB

Concernant mongoDB nous utilisons docker, voir la documentation suivante pour l'installer : https://docs.docker.com/get-docker/.

Il vous faudra également docker-compose. La documentation est disponible ici : https://docs.docker.com/compose/install/.

Une fois ces deux outils installés, il suffit de créer un docker-compose.yml dans un répertoire quelconque exemple: /home/user/mongo.

Le contenu du docker-compose.yml est le suivant :

### docker-compose.yml pour mongoDB
```
version: "3.7"
services:
  mongo_sncf:
    container_name: mongosncf
    image: andresvidal/rpi3-mongodb3
    volumes:
      - ./data/db:/data/db
    ports:
      - "27017:27017"
    command: mongod --auth
    networks:
      - network
networks:
```

Pour lancer le service, utilisez la commande :

```
docker-compose up -d
```

En utilisant la commande suivante vous devriez voir votre service "up" :

```
docker ps 
```

### Serveur Node - Express 

Pour notre application, nous avons du créer un serveur qui s'occupe du back-end. L'idée étant de fournir une API
qui formatte nos données pour que le front-end s'en serve le plus simplement possible. De plus, point de vue performance, le front n'a 
plus besoin de procéder à des calculs, notamment les calculs de moyennes pour lesquels l'itération sur l'ensemble des données est nécessaire.

Ce serveur express a deux rôles :

1. Indexer les données dans notre base mongoDB en planifiant tous les jours une récupération des données de l'API (planifié avec Cron par exemple).

2. Fournir les données demandées par le client dès reception de requêtes HTTP (API REST)

Notre application express est disponible ici : 

https://gitlab.com/master-2-idc/sncf-api-formatter

Pour la déployer référez vous au README correspondant.

### Application Vue principale

Notre application Vue tourne également grâce à docker. Pour cela il suffit de faire tourner un server nginx pour servir notre application.

Préalablement il vous faudra créer le fichier de configuration suivant pour le container nginx (situé ici à la racine de notre projet vue) : 

### Configuration server NGINX

```
server {
        listen 80 default_server;
        listen [::]:80 default_server;
        root /usr/share/nginx/html;

        index index.html;


        location / {
                try_files $uri $uri/ /index.html;
        }
}
```
Ensuite, à la racine du projet vue lancez la commande suivante pour installer les librairies dans le dossier node_modules:

```
npm install
```

Une fois les librairies installées, utilisez la commande suivante pour générer les fichiers dédiés à la production dans le dossier dist: 

```
npm run build
```

Une fois tous cela configuré, il vous faudra créer un autre docker-compose à la racine du projet avec le contenu suivant :

### docker-compose.yml pour l'application vuejs

```
version: '3.7'
services:
  sncf-nginx:
    image: nginx:latest
    container_name: sncf-nginx
    ports:
      - "80:80"
    volumes:
      - ./sncf-nginx.conf:/etc/nginx/conf.d/default.conf
      - ./dist/:/usr/share/nginx/html/
```

Remarque : Attention aux chemins vers la configuration de nginx et du dossier dist/ si vous les avez modifiés.

Une des dernières étapes est de copier le fichier .env.sample dans un fichier .env et de spécifier l'hôte et le port qui héberge l'application express.

Une fois que MongoDB et Express sont lancés, vous pourrez finalement lancer l'application Vue en vous situant à la racine du projet grâce à :

```
docker-compose up -d
```

Félicitations ! Tout est maintenant fonctionnel ! Votre application est disponible sur le port 80 de votre serveur.

### Démonstration 

Une vidéo de démonstration est disponible à l'adresse https://youtu.be/PS5WFQTVr3k.

Une version testable de l'application est disponible à l'adresse http://antoinegonzalez.fr




