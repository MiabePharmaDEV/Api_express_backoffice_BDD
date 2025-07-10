# API Express Backoffice

Cette API Express.js permet de gérer un backoffice pour une application de gestion de pharmacies, produits, utilisateurs, commandes, gardes, etc. Elle utilise PostgreSQL avec PostGIS pour la gestion des données géographiques.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Pré-requis](#pré-requis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement en local](#lancement-en-local)
- [Déploiement sur Render](#déploiement-sur-render)
- [Structure des endpoints](#structure-des-endpoints)
- [Exemples de requêtes](#exemples-de-requêtes)
- [Sécurité](#sécurité)

---

## Fonctionnalités

- Gestion des pharmacies (CRUD, coordonnées géographiques)
- Gestion des produits et catégories
- Gestion des utilisateurs (CRUD, authentification, coordonnées)
- Gestion des commandes (CRUD, jointures, filtrage)
- Gestion des gardes (CRUD, pharmacies de garde, statut actif)
- Gestion des pharmaciens (CRUD, authentification, hashage des mots de passe)

---

## Pré-requis

- Node.js >= 14
- PostgreSQL >= 12 avec l'extension PostGIS
- Un compte GitHub (pour le déploiement sur Render)

---

## Installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd api_express_backoffice
   ```
2. **Installer les dépendances**
   ```bash
   npm install
   ```
3. **Créer la base de données**
   - Exécute le script `script.sql` dans PostgreSQL pour créer les tables et extensions nécessaires.

---

## Configuration

Crée un fichier `.env` à la racine du projet avec le contenu suivant :

```env
PORT=3000
PGUSER=ton_user
PGPASSWORD=ton_mot_de_passe
PGHOST=localhost
PGPORT=5432
PGDATABASE=ta_base
```

**Ne pousse jamais ce fichier sur GitHub !**

---

## Lancement en local

```bash
npm start
```

L'API sera accessible sur `https://api-express-backoffice-bdd.onrender.com/pharmacies`

---

## Déploiement sur Render

1. Pousse ton code sur GitHub.
2. Va sur [https://dashboard.render.com/](https://dashboard.render.com/), crée un **Web Service** et connecte ton repo.
3. Renseigne les variables d'environnement (voir section Configuration).
4. Build command : `npm install` (ou laisse vide)
5. Start command : `npm start`
6. Clique sur **Create Web Service**.
7. L'API sera accessible à l'URL fournie par Render.

---

## Structure des endpoints

### Pharmacies

- `GET    /pharmacies` : liste toutes les pharmacies
- `GET    /pharmacies/:id` : détails d'une pharmacie (coordonnées en {longitude, latitude})
- `POST   /pharmacies` : créer une pharmacie
- `PUT    /pharmacies/:id` : modifier une pharmacie
- `DELETE /pharmacies/:id` : supprimer une pharmacie

### Produits

- `GET    /produits` : liste tous les produits
- `GET    /produits/:id` : détails d'un produit
- `POST   /produits` : créer un produit
- `PUT    /produits/:id` : modifier un produit
- `DELETE /produits/:id` : supprimer un produit
- `GET    /produits/categorie/:id_categorie` : produits d'une catégorie

### Catégories

- `GET    /categories` : liste toutes les catégories
- `POST   /categories` : créer une catégorie
- `GET    /categories/:id` : détails d'une catégorie
- `PUT    /categories/:id` : modifier une catégorie
- `DELETE /categories/:id` : supprimer une catégorie
- `GET    /categories/nom/:nom` : recherche par nom
- `GET    /categories/:id/produits` : catégorie avec ses produits
- `GET    /categories/stats/count` : stats nombre de produits par catégorie

### Utilisateurs

- `GET    /utilisateurs` : liste tous les utilisateurs
- `POST   /utilisateurs` : créer un utilisateur
- `GET    /utilisateurs/:id` : détails d'un utilisateur
- `PUT    /utilisateurs/:id` : modifier un utilisateur
- `DELETE /utilisateurs/:id` : supprimer un utilisateur
- `POST   /utilisateurs/login` : authentification

### Pharmaciens

- `GET    /pharmaciens` : liste tous les pharmaciens
- `POST   /pharmaciens` : créer un pharmacien
- `GET    /pharmaciens/:id` : détails d'un pharmacien
- `PUT    /pharmaciens/:id` : modifier un pharmacien
- `DELETE /pharmaciens/:id` : supprimer un pharmacien
- `POST   /pharmaciens/login` : authentification

### Commandes

- `GET    /commandes` : liste toutes les commandes
- `POST   /commandes` : créer une commande
- `GET    /commandes/:id` : détails d'une commande
- `PUT    /commandes/:id` : modifier une commande
- `DELETE /commandes/:id` : supprimer une commande
- `GET    /commandes/pharmacie/:id_pharmacie` : commandes d'une pharmacie
- `GET    /commandes/utilisateur/:id_utilisateur` : commandes d'un utilisateur
- `GET    /commandes/statut/:statut` : commandes par statut

### Gardes

- `GET    /gardes` : liste toutes les gardes
- `POST   /gardes` : créer une garde
- `GET    /gardes/:id` : détails d'une garde
- `PUT    /gardes/:id` : modifier une garde
- `DELETE /gardes/:id` : supprimer une garde
- `GET    /gardes/actives` : gardes actives
- `GET    /gardes/pharmacie/:id_pharmacie` : gardes d'une pharmacie
- `GET    /gardes/pharmacies/list` : liste des pharmacies (ID + nom)

---

## Exemples de requêtes

### Créer une pharmacie

```json
{
  "nom": "Pharmacie du Marché",
  "emplacement": "Marché central",
  "telephone1": "0123456789",
  "telephone2": "0987654321",
  "coordonnees": "POINT(1.2075 6.1287)"
}
```

### Créer un pharmacien

```json
{
  "id_pharmacie": 1,
  "nom_utilisateur": "pharma2024",
  "mot_de_passe": "monSuperMotDePasse"
}
```

### Créer une garde

```json
{
  "debut_garde": "2024-06-10T20:00:00",
  "fin_garde": "2024-06-11T08:00:00",
  "pharmacies_garde": [1, 2, 3],
  "isactive": true
}
```

---

## Exemples de requêtes et de réponses

### Pharmacies

#### Créer une pharmacie (POST /pharmacies)

**Body :**

```json
{
  "nom": "Pharmacie du Marché",
  "emplacement": "Marché central",
  "telephone1": "0123456789",
  "telephone2": "0987654321",
  "coordonnees": "POINT(1.2075 6.1287)"
}
```

**Réponse (GET /pharmacies/1) :**

```json
{
  "id_pharmacie": 1,
  "nom": "Pharmacie du Marché",
  "emplacement": "Marché central",
  "telephone1": "0123456789",
  "telephone2": "0987654321",
  "coordonnees": {
    "longitude": 1.2075,
    "latitude": 6.1287
  },
  "produits": [],
  "commandes_resume": []
}
```

#### Modifier une pharmacie (PUT /pharmacies/:id)

**Body :**

```json
{
  "nom": "Pharmacie du Centre",
  "emplacement": "Avenue de la Santé",
  "telephone1": "0123456789",
  "telephone2": "0987654321",
  "coordonnees": "POINT(1.2100 6.1300)"
}
```

---

### Produits

#### Créer un produit (POST /produits)

**Body :**

```json
{
  "id_categorie": 1,
  "libelle": "Paracétamol 500mg",
  "description": "Antalgique et antipyrétique",
  "unite": "boîte",
  "prix_unitaire": 150,
  "sur_ordonnance": false
}
```

**Réponse (GET /produits/1) :**

```json
{
  "id_produit": 1,
  "id_categorie": 1,
  "libelle": "Paracétamol 500mg",
  "description": "Antalgique et antipyrétique",
  "unite": "boîte",
  "prix_unitaire": 150,
  "sur_ordonnance": false,
  "nom_categorie": "Antalgiques"
}
```

#### Modifier un produit (PUT /produits/:id)

**Body :**

```json
{
  "id_categorie": 1,
  "libelle": "Paracétamol 1g",
  "description": "Antalgique puissant",
  "unite": "boîte",
  "prix_unitaire": 250,
  "sur_ordonnance": true
}
```

---

### Catégories

#### Créer une catégorie (POST /categories)

**Body :**

```json
{
  "nom": "Antalgiques",
  "description": "Médicaments contre la douleur"
}
```

**Réponse (GET /categories/1) :**

```json
{
  "id_categorie": 1,
  "nom": "Antalgiques",
  "description": "Médicaments contre la douleur"
}
```

#### Modifier une catégorie (PUT /categories/:id)

**Body :**

```json
{
  "nom": "Antalgiques",
  "description": "Médicaments pour soulager la douleur et la fièvre"
}
```

---

### Utilisateurs

#### Créer un utilisateur (POST /utilisateurs)

**Body :**

```json
{
  "nom": "Dupont",
  "prenoms": "Jean",
  "adresse_courant": "POINT(1.2075 6.1287)",
  "telephone": "0123456789",
  "email": "jean.dupont@email.com",
  "mot_de_passe": "motdepasse123"
}
```

**Réponse (GET /utilisateurs/1) :**

```json
{
  "id_utilisateur": 1,
  "nom": "Dupont",
  "prenoms": "Jean",
  "adresse_courant": "POINT(1.2075 6.1287)",
  "telephone": "0123456789",
  "email": "jean.dupont@email.com"
}
```

#### Modifier un utilisateur (PUT /utilisateurs/:id)

**Body :**

```json
{
  "nom": "Dupont",
  "prenoms": "Jean-Pierre",
  "adresse_courant": "POINT(1.2100 6.1300)",
  "telephone": "0123456789",
  "email": "jean.dupont@email.com"
}
```

---

### Pharmaciens

#### Créer un pharmacien (POST /pharmaciens)

**Body :**

```json
{
  "id_pharmacie": 1,
  "nom_utilisateur": "pharma2024",
  "mot_de_passe": "monSuperMotDePasse"
}
```

**Réponse (GET /pharmaciens/1) :**

```json
{
  "id_pharmacien": 1,
  "id_pharmacie": 1,
  "nom_utilisateur": "pharma2024",
  "mot_de_passe": "$2b$10$...hash..."
}
```

#### Modifier un pharmacien (PUT /pharmaciens/:id)

**Body :**

```json
{
  "id_pharmacie": 1,
  "nom_utilisateur": "pharma2024",
  "mot_de_passe": "nouveauMotDePasse"
}
```

---

### Commandes

#### Créer une commande (POST /commandes)

**Body :**

```json
{
  "id_pharmacie": 1,
  "id_utilisateur": 1,
  "produits": [
    {
      "id_produit": 1,
      "libelle": "Paracétamol 500mg",
      "quantite": 2,
      "prix_unitaire": 150,
      "prix_total": 300
    }
  ],
  "statut": "en cours",
  "code_commande": "CMD001"
}
```

**Réponse (GET /commandes/1) :**

```json
{
  "id_commande": 1,
  "id_pharmacie": 1,
  "id_utilisateur": 1,
  "produits": [
    {
      "id_produit": 1,
      "libelle": "Paracétamol 500mg",
      "quantite": 2,
      "prix_unitaire": 150,
      "prix_total": 300
    }
  ],
  "statut": "en cours",
  "code_commande": "CMD001",
  "created_at": "2024-06-10T20:00:00.000Z",
  "nom_pharmacie": "Pharmacie du Marché",
  "nom_utilisateur": "Dupont"
}
```

#### Modifier une commande (PUT /commandes/:id)

**Body :**

```json
{
  "id_pharmacie": 1,
  "id_utilisateur": 1,
  "produits": [
    {
      "id_produit": 1,
      "libelle": "Paracétamol 1g",
      "quantite": 1,
      "prix_unitaire": 250,
      "prix_total": 250
    }
  ],
  "statut": "livrée",
  "code_commande": "CMD001"
}
```

---

### Gardes

#### Créer une garde (POST /gardes)

**Body :**

```json
{
  "debut_garde": "2024-06-10T20:00:00",
  "fin_garde": "2024-06-11T08:00:00",
  "pharmacies_garde": [1, 2, 3],
  "isactive": true
}
```

**Réponse (GET /gardes/1) :**

```json
{
  "id_garde": 1,
  "debut_garde": "2024-06-10T20:00:00.000Z",
  "fin_garde": "2024-06-11T08:00:00.000Z",
  "pharmacies_garde": [1, 2, 3],
  "isactive": true
}
```

#### Modifier une garde (PUT /gardes/:id)

**Body :**

```json
{
  "debut_garde": "2024-06-12T20:00:00",
  "fin_garde": "2024-06-13T08:00:00",
  "pharmacies_garde": [2, 3],
  "isactive": false
}
```

---

## Sécurité

- Les mots de passe des pharmaciens sont hashés avec bcrypt.
- Ne jamais exposer les mots de passe en clair.
- Ne jamais pousser le fichier `.env` sur GitHub.
- Utiliser HTTPS en production (Render le fait automatiquement).

---

## Aide

Pour toute question ou problème, ouvre une issue sur le dépôt GitHub ou contacte le mainteneur du projet.
