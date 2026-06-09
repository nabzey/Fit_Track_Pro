# Fit Track Pro - Module "Bilan Journalier"

Ce projet est une application web réactive développée avec **Angular 21**, conçue pour suivre les indicateurs physiques quotidiens. Elle propose un tableau de bord modulaire permettant de saisir des activités, de visualiser un journal chronologique, d'obtenir des statistiques en temps réel et d'afficher des alertes de santé.

---

## 1. Architecture du Code

Pour éviter de surcharger le composant racine `App`, le code est divisé en plusieurs fichiers distincts et indépendants :

* **`src/app/activity.model.ts`** : Interface TypeScript partagée qui définit la structure stricte d'une activité (`id`, `name`, `type`, `value`, `createdAt`).
* **`src/app/dashboard/`** (Nouveau composant) :
  * **`dashboard.ts`** : Contient toute la logique métier, la gestion d'état avec les **Signals** d'Angular, les propriétés dérivées (`computed`) et la persistance locale (`effect` + `localStorage` sécurisé pour le SSR).
  * **`dashboard.html`** : Structure HTML utilisant la nouvelle syntaxe de contrôle de flux d'Angular (`@if`, `@else`, `@for ... track` et `@empty`).
  * **`dashboard.css`** : Charte graphique moderne avec des **couleurs unies simples** (sans dégradé), conforme aux attentes visuelles.
* **`src/app/app.ts` & `app.html`** : Point d'entrée de l'application. Très léger, il se contente d'importer et d'afficher le sélecteur `<app-dashboard></app-dashboard>`.

---

## 2. Fonctionnalités Implémentées

### A. Formulaire & Validation Intégrée
* L'utilisateur peut saisir un nom d'activité, sélectionner son type (`SPORT` ou `HYDRATATION`) et renseigner sa valeur (en kcal pour le sport, ou en ml pour l'eau).
* **Validation Inline** : Contrairement aux alertes pop-up système intrusives, les erreurs de saisie (champ vide, valeur négative ou nulle) s'affichent sous forme de **message textuel rouge et dynamique** sous le bouton d'ajout. Ce message disparait automatiquement dès que l'utilisateur recommence à écrire ou à modifier le formulaire.

### B. Indicateurs en Temps Réel
Trois indicateurs clés sont mis à jour instantanément à chaque ajout ou suppression d'activité :
1. **Calories brûlées** (somme des activités de type `SPORT`).
2. **Eau consommée** (somme des activités de type `HYDRATATION`).
3. **Bilan calorique restant** : calculé sur la base d'un objectif fixe de **2000 kcal** (`Objectif - Calories brûlées`).

### C. Alertes de Santé Intelligentes
Évaluation en temps réel de l'état de l'utilisateur :
* **Déshydratation (Alerte)** : S'affiche tant que le volume total d'eau est **strictement inférieur à 1500 ml**.
* **Objectif Santé Atteint (Félicitations)** : Remplace l'alerte dès que le volume d'eau atteint ou dépasse **1500 ml** **ET** que la dépense physique dépasse **500 kcal**.
* **Statut intermédiaire** : S'affiche si l'eau atteint 1500 ml mais que les calories brûlées sont inférieures ou égales à 500 kcal (encourage à faire du sport).

### D. Persistance SSR-Safe
* Les activités sont enregistrées automatiquement dans le `localStorage` du navigateur.
* Les accès au `localStorage` sont protégés par une vérification `isPlatformBrowser` afin de ne pas perturber le rendu côté serveur (SSR).

---

## 3. Commandes du Projet

### Lancer le serveur de développement
```bash
npm start
```
L'application est alors accessible à l'adresse `http://localhost:4200/`.

### Lancer les tests unitaires (Vitest)
```bash
npm run test
```
Les tests valident la création du composant, la réactivité des calculs de Signals/Computed et le fonctionnement de la validation du formulaire.
