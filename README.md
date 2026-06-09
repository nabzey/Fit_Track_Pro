# Fit Track Pro - Module "Bilan Journalier"

Ce projet est une application web moderne et réactive développée avec **Angular 21**, conçue pour aider les utilisateurs à suivre leurs indicateurs physiques quotidiens. Elle propose un tableau de bord performant permettant de saisir des activités, de visualiser un journal chronologique, d'obtenir des statistiques en temps réel et de recevoir des alertes de santé intelligentes.

---

## 1. Objectifs & Fonctionnalités

L'application s'articule autour d'un tableau de bord interactif divisé en quatre axes principaux :

### A. Enregistrement des Activités
* **Formulaire réactif et intuitif** : Permet de saisir rapidement une nouvelle activité.
* **Propriétés d'une activité** :
  * **Nom** : Libellé descriptif (ex: *Jogging matinal*, *Grand verre d'eau*).
  * **Type d'activité** : Sélection entre `SPORT` (dépense énergétique) et `HYDRATATION` (apport hydrique).
  * **Valeur numérique** : S'adapte dynamiquement selon le type (calories brûlées en **kcal** pour le sport, ou volume en **ml** pour l'hydratation).

### B. Indicateurs en Temps Réel (Dashboard)
Trois indicateurs clés sont recalculés instantanément à chaque ajout ou modification :
1. **Total des calories brûlées** (somme des calories de toutes les activités de type `SPORT`).
2. **Total de l'eau consommée** (somme des volumes de toutes les activités de type `HYDRATATION`).
3. **Bilan calorique restant** : Calculé par rapport à un objectif quotidien par défaut de **2000 kcal** (`Objectif - Calories Brûlées`).

### C. Alertes de Santé Intelligentes
Le système évalue en continu l'état de l'utilisateur et affiche des messages dynamiques :
* **Avertissement critique (Déshydratation)** : Visible tant que le volume total d'eau est **strictement inférieur à 1500 ml**.
* **Félicitations ("Objectif Santé Atteint")** : S'affiche dès que le volume d'eau atteint ou dépasse **1500 ml** **ET** que les calories brûlées dépassent **500 kcal**. L'avertissement de déshydratation disparaît alors au profit de ce badge de réussite.
* **État d'encouragement intermédiaire** : Si l'hydratation est atteinte ($\ge 1500$ ml) mais que la dépense physique est encore insuffisante ($\le 500$ kcal), un message encourage l'utilisateur à bouger.

### D. Persistance Locale
* **Sauvegarde automatique** : Pour éviter toute perte de données lors d'un rafraîchissement accidentel (`F5`), l'état de l'application est automatiquement persisté dans le `localStorage` du navigateur.
* **Compatibilité SSR (Server-Side Rendering)** : Le chargement et la sauvegarde du stockage local sont sécurisés pour éviter les erreurs lors de l'exécution côté serveur (SSR).

---

## 2. Contraintes & Choix Techniques (Angular 21)

L'architecture repose exclusivement sur les fonctionnalités modernes d'Angular :

1. **Composants Standalone** :
   * Configuration sans `NgModule`. Le composant principal `App` configure directement ses dépendances via le tableau `imports`.
2. **Gestion de l'état avec les Signals** :
   * L'état des activités est stocké dans un signal réactif : `readonly activities = signal<Activity[]>(...)`.
   * Les totaux et les alertes de santé sont calculés de manière dérivée avec `computed()`. Cela garantit que les calculs ne sont réévalués que lorsque le signal source change.
3. **Nouveau Control Flow** :
   * Utilisation de la syntaxe native d'Angular `@if`, `@else` et `@for` avec la clé de suivi `track activity.id` pour une réactivité optimale du DOM.
4. **Hydratation & Sécurité SSR** :
   * Utilisation de `PLATFORM_ID` et `isPlatformBrowser` pour sécuriser les accès à `localStorage`.

---

## 3. Guide de Démarrage et Commandes

### Démarrer le serveur de développement
```bash
npm start
```
Une fois démarré, ouvrez votre navigateur à l'adresse `http://localhost:4200/`.

### Lancer la compilation de production
```bash
npm run build
```

### Lancer les tests unitaires (Vitest)
```bash
npm run test
```
