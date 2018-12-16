# ECE PROJET AST

[![Build Status](https://travis-ci.org/ongphil/ast_tp1.svg?branch=master)](https://travis-ci.org/ongphil/ast_tp1)

Ce projet permet de gérer des utilisateurs et leurs metrics. Il s'agit d'un projet étudiant dans le cadre du cours Asynchronous Server Technologies à l'ECE Paris.

## Instructions

### Préréquis

Cette application nécessite au préalable d'avoir installé NodeJS.  
https://nodejs.org/en/

Version utilisée lors du développement :

```
node v10.13.0
```

### Installation

Clonez ce projet dans le répertoire souhaité en tapant la commande suivante dans votre terminale :

```
git clone https://github.com/ongphil/ast_tp1.git
```
Déplacez vous vers le dossier où vous avez cloné le projet et lancez les commandes suivantes :

```
npm install
npm run populate
npm run build
```

### Lancement

Pour lancer l'application, exécutez la commande suivante :

```
npm run start
```

### Tests unitaires

Pour lancer les tests unitaires, exécutez la commande suivante :

```
npm run test
```

### Routes

#### NAVIGATION WEB

##### GET :
- `/` : redirige vers la page login si aucun utilisateur n'est connecté, redirige vers la page index si c'est le cas
- `/login` : page de login
- `/signup` : page d'inscription
- `/logout` : déconnecte l'utilisateur actuel
##### POST :
- `/login` : connexion d'un utilisateur et redirection vers la page index en cas de succès. Redirige vers la page de login si les informations entrées sont incorrectes
- `/signup` : sauvegarde les informations dun utilisateur après inscription

#### API REST
##### GET :
- `/user/{username}` : récupère les informations d'un utilisateur
- `/metrics/{username}` : récupère tous les metrics d'un utilisateur
- `/metrics/{username}/{id}` : récupère un groupe de metrics

##### POST :
- `/user` : sauvegarde les informations d'un utilisateur
- `/metrics/{username}` : sauvegarde un metric pour un utilisateur

##### DELETE :
- `/user/{username}` : supprime les informations d'un utilisateur
- `/metrics/{username}/{id}` : supprime un groupe de metrics d'un utilisateur

## Contributeurs

Ong Philippe  
philippe.ong@edu.ece.fr

## License

UNLICENSED
