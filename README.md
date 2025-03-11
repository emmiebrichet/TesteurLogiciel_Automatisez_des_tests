# **Automatisation des tests - Eco Bliss Bath**
Ce projet contient des tests automatisés pour la boutique en ligne Eco Bliss Bath. Il inclut des tests API, des tests de type smoke tests, ainsi que des tests fonctionnels pour l'affichage des produits et la fonctionnalité de login.

#### Installation du projet
1. Cloner le dépôt
Clonez ce dépôt en utilisant la commande suivante :


git clone https://github.com/emmiebrichet/TesteurLogiciel_Automatise.git
cd TesteurLogiciel_Automatise

2. Lancer l'application avec Docker
Pour démarrer l'application avec Docker, exécutez :

sudo docker-compose up --build
Note : Sous Windows, ne pas utiliser sudo (sauf si vous utilisez la dernière version de Windows 11). Docker Desktop est configuré pour ne pas nécessiter de droits administrateur.

3. Accéder à l'application
Une fois l'application lancée, ouvrez votre navigateur et accédez à l'adresse suivante :

http://localhost:8080

### Exécution du projet
Prérequis
Assurez-vous que Docker et Docker Compose sont installés sur votre machine.

Démarrer l'application en local
Utilisez la commande suivante pour démarrer l'application :


sudo docker-compose up --build
Cette commande va construire et démarrer tous les services nécessaires au bon fonctionnement de l'application.

Une fois l'application lancée, vous pouvez y accéder via le navigateur à l'adresse suivante : http://localhost:8080

#### Lancer les tests
1. Installer les dépendances
Avant de lancer les tests, vous devez installer les dépendances nécessaires. Exécutez la commande suivante dans le répertoire du projet :


npm install
2. Lancer les tests avec Cypress
Mode interactif
Pour exécuter les tests en mode interactif (avec l'interface graphique de Cypress), utilisez la commande suivante :


npx cypress open
Cela ouvrira l'interface de Cypress où vous pourrez choisir et exécuter les tests manuellement.

#### Mode automatisé
Si vous préférez exécuter les tests en mode automatisé (en ligne de commande), utilisez la commande suivante :

npx cypress run
Cela exécutera tous les tests et affichera les résultats directement dans le terminal.

Générer un rapport
1. Rapport après l'exécution des tests
Après avoir exécuté les tests avec npx cypress run, Cypress générera un rapport détaillant tous les tests réussis, échoués ou ignorés.

2. Vérifier les résultats
Vous pouvez consulter les résultats directement dans le terminal après l'exécution des tests, ou accéder à l'interface de Cypress pour voir les rapports en temps réel si vous avez utilisé la commande npx cypress open.

#### Informations de connexion
Pour tester la fonctionnalité de login, utilisez les informations suivantes :

Email : test2@test.fr
Mot de passe : testtest