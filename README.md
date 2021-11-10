![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)
![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)


# Visio - Vidéo conférence & messagerie

L'objectif de ce projet est de réaliser un site internet communiquant avec un backend développé sans framework.
Visio permet d'envoyer des messages texte, ainsi que de lancer des appels vidéo et audio. La fonction partage d'écran permet de faire visualiser à son correspondant l'écran souhaité. 

**Démo :** [**https://visio.victordurand.fr**](https://visio.victordurand.fr)  
## Développement

Ce projet est dépendant d' [**Angular**](https://angular.io/)

```bash
# Clonez le dépot Github 
$ git clone https://github.com/victordrnd/visio-front.git

# Aller vers le répertoire
$ cd visio-front

# Installer les dépendances
$ npm i

# Démarrer le serveur (nécessite @angular/cli)
$ ng serve
```


## Déploiement

```bash
# Transpiler le code javascript
$ ng build --prod

# Déployer le projet sur Github Pages
$ npm run deploy
```
