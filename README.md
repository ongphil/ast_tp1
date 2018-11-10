# TP1 : application Hello
Une simple application Hello pour pratiquer les modules et le routing sur NodeJS.


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

### Lancement
Pour lancer l'application, déplacez vous vers le dossier où vous avez cloné le projet et exécutez la commande suivante :
```
node index.js
```
### Utilisation
Le contenu de la page varie en fonction de la route.  
- `/` : explication du fonctionnement de l'application
- `/hello?name={nom}` : affiche "Hello nom"
- `/hello?name=philippe` : affiche une petite présentation de l'auteur
- toute autre route envoie une erreur 404


## Contributeurs
Ong Philippe  
philippe.ong@edu.ece.fr