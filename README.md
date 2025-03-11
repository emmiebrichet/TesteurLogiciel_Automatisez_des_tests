# **Automatisation des tests - Eco Bliss Bath**
Ce projet contient des tests automatisés pour la boutique en ligne Eco Bliss Bath. Il inclut des tests API, des tests de type smoke tests, ainsi que des tests fonctionnels pour l’affichage des produits et la fonctionnalité de login.

## Prérequis
Avant de commencer, assurez-vous que vous avez les outils suivants installés sur votre machine :

Docker et Docker Compose pour lancer l'application.
Node.js et npm pour installer les dépendances nécessaires aux tests.
Cypress pour effectuer les tests automatisés.

### **1. Installation du projet**
#### 1.1 Cloner le dépôt
Clonez le dépôt en utilisant la commande suivante :

*git clone https://github.com/emmiebrichet/TesteurLogiciel_Automatise.git*
*cd TesteurLogiciel_Automatise*

### **1.2 Installer Docker**
#### 1.2.1 Sous Windows/macOS
Téléchargez et installez Docker Desktop depuis docker.com. Une fois installé, ouvrez Docker Desktop.

#### 1.2.2 Sous Linux
Installez Docker en suivant les instructions sur la documentation officielle de Docker. Vérifiez que Docker est bien installé avec la commande :


*docker --version*

#### 1.2.3 Installer Docker Compose
Sous Windows/macOS : Docker Compose est inclus dans Docker Desktop, vous n'avez pas besoin de l'installer séparément.
Sous Linux : Installez Docker Compose en suivant les instructions sur la documentation officielle de Docker Compose. Vérifiez l'installation de Docker Compose avec la commande :

*docker-compose --version*
### 2. Lancer l'application
#### 2.1 Démarrer l’application avec Docker
Pour démarrer l’application avec Docker, exécutez la commande suivante :

*sudo docker-compose up --build*
Note : Sous Windows, ne pas utiliser sudo (sauf si vous utilisez la dernière version de Windows 11).

#### 2.2 Accéder à l’application
Une fois l’application lancée, ouvrez votre navigateur et accédez à l’adresse suivante :

*http://localhost:8080*

#### 2.3 API Documentation
Vous pouvez accéder à la documentation de l'API à l'adresse suivante :

*http://localhost:8081/api/doc*

## 3. Lancer les tests
### 3.1 Installer les dépendances
Avant de pouvoir exécuter les tests, vous devez installer les dépendances du projet. Dans le répertoire du projet, exécutez la commande suivante :

*npm install*
### 3.2 Installer Cypress
Cypress est utilisé pour les tests automatisés. Pour l'installer, exécutez la commande suivante dans le répertoire du projet :

*npm install cypress --save-dev*

### 3.3 Lancer les tests avec Cypress
#### 3.3.1 Mode interactif
Pour exécuter les tests en mode interactif (avec l’interface graphique de Cypress), utilisez la commande suivante :

*npx cypress open*

Cela ouvrira l'interface de Cypress, où vous pourrez choisir et exécuter les tests manuellement.

#### 3.3.2 Mode automatisé
Si vous préférez exécuter les tests en mode automatisé (en ligne de commande), utilisez la commande suivante :


*npx cypress run*

Cela exécutera tous les tests et affichera les résultats directement dans le terminal.

## 4. Générer un rapport
### 4.1 Rapport après l’exécution des tests
Après avoir exécuté les tests avec npx cypress run, Cypress générera un rapport détaillant tous les tests réussis, échoués ou ignorés.

### 4.2 Vérifier les résultats
Vous pouvez consulter les résultats des tests directement dans le terminal après l’exécution des tests. Si vous avez utilisé le mode interactif avec npx cypress open, vous pouvez également voir les rapports en temps réel dans l'interface de Cypress.

## 5. Informations de connexion
Pour tester la fonctionnalité de login, utilisez les informations suivantes :

*Email : test2@test.fr*
*mot de pass: testtest*