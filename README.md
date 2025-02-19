Automatisation des tests - Eco Bliss Bath
Ce projet contient des tests automatisés pour la boutique en ligne Eco Bliss Bath. Il inclut des tests API, des tests de type smoke tests, ainsi que des tests fonctionnels pour l'affichage des produits et la fonctionnalité de login.

Installation du projet
Clonez le dépôt :


git clone https://github.com/emmiebrichet/TesteurLogiciel_Automatise.git
cd TesteurLogiciel_Automatise
Lancer l'application avec Docker :


sudo docker-compose up --build
Note : Sous Windows, ne pas utiliser sudo (sauf si vous utilisez la dernière version de Windows 11).
Docker Desktop est configuré pour ne pas nécessiter de droits administrateur.

Accédez à l'application depuis votre navigateur :
Ouvrez la page http://localhost:8080

Exécution du projet
Pour exécuter l'application en local :

Assurez-vous d'avoir Docker et Docker Compose installés.

Utilisez la commande suivante pour démarrer l'application :


sudo docker-compose up --build
Cette commande va construire et démarrer tous les services nécessaires pour faire fonctionner l'application.

Une fois l'application lancée, vous pouvez y accéder depuis votre navigateur à l'adresse suivante :
http://localhost:8080

Lancer les tests
Installez les dépendances : Une fois dans le répertoire du projet, installez les dépendances nécessaires avec :


npm install
Lancez les tests avec Cypress : Pour lancer les tests en mode interactif avec l'interface graphique de Cypress, exécutez la commande suivante :


npx cypress open
Cela ouvrira l'interface de Cypress où vous pourrez choisir et exécuter les tests manuellement.

Si vous souhaitez exécuter les tests de manière automatisée (en ligne de commande), utilisez cette commande :


npx cypress run
Cela exécutera tous les tests et affichera les résultats directement dans le terminal.

Générer un rapport
Génération du rapport après l'exécution des tests : Une fois que les tests sont exécutés via npx cypress run, Cypress générera un rapport de test détaillant tous les tests réussis, échoués ou ignorés.

Vérifiez les résultats des tests : Vous pouvez consulter les résultats directement dans le terminal après l'exécution de npx cypress run, ou vous pouvez également accéder à l'interface de Cypress pour voir les rapports en temps réel si vous avez utilisé npx cypress open.
