-- Activation des extensions
CREATE EXTENSION IF NOT EXISTS postgis;
-- Table des administrateurs
CREATE TABLE public.admins (
  id SERIAL PRIMARY KEY,
  nom VARCHAR NOT NULL,
  username VARCHAR NOT NULL UNIQUE,
  email VARCHAR NOT NULL UNIQUE,
  mot_de_passe VARCHAR NOT NULL,
  remember_token VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
--Table Catégories
CREATE TABLE public.categories (
  id_categorie SERIAL PRIMARY KEY,
  nom VARCHAR NOT NULL UNIQUE,
  description TEXT
);

-- Table des utilisateurs
CREATE TABLE public.utilisateurs (
  id_utilisateur SERIAL PRIMARY KEY,
  nom VARCHAR NOT NULL,
  prenoms VARCHAR,
  adresse_courant GEOGRAPHY(Point, 4326),
  telephone VARCHAR UNIQUE,
  email VARCHAR NOT NULL UNIQUE,
  mot_de_passe VARCHAR NOT NULL
);

-- Table des pharmacies
CREATE TABLE public.pharmacies (
  id_pharmacie SERIAL PRIMARY KEY,
  nom VARCHAR NOT NULL,
  emplacement TEXT NOT NULL,
  telephone1 VARCHAR,
  telephone2 VARCHAR,
  coordonnees GEOGRAPHY(Point, 4326) NOT NULL,
  produits JSONB DEFAULT '[]'::jsonb,
  commandes_resume JSONB DEFAULT '[]'::jsonb  -- Résumé des commandes de cette pharmacie
);

-- Table des pharmaciens
CREATE TABLE public.pharmaciens (
  id_pharmacien SERIAL PRIMARY KEY,
  id_pharmacie INTEGER NOT NULL REFERENCES public.pharmacies(id_pharmacie),
  nom_utilisateur VARCHAR NOT NULL UNIQUE,
  mot_de_passe VARCHAR NOT NULL
);

-- Table des gardes
CREATE TABLE public.gardes (
  id_garde SERIAL PRIMARY KEY,
  debut_garde TIMESTAMP NOT NULL,
  fin_garde TIMESTAMP NOT NULL,
  pharmacies_garde JSONB DEFAULT '[]'::jsonb,
  isactive BOOLEAN DEFAULT FALSE
);

-- Table des commandes (partitionnée par mois sur created_at)
CREATE TABLE public.commandes (
  id_commande SERIAL,
  id_pharmacie INTEGER NOT NULL REFERENCES public.pharmacies(id_pharmacie),
  id_utilisateur INTEGER NOT NULL REFERENCES public.utilisateurs(id_utilisateur),
  produits JSONB DEFAULT '[]'::jsonb,
  statut VARCHAR NOT NULL DEFAULT 'en cours',
  code_commande VARCHAR(6),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id_commande, created_at)
) PARTITION BY RANGE (created_at);

-- Partitions mensuelles (exemples)
CREATE TABLE public.commandes_2025_06 PARTITION OF public.commandes
  FOR VALUES FROM ('2025-06-01') TO ('2025-07-01');

CREATE TABLE public.commandes_2025_07 PARTITION OF public.commandes
  FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');

CREATE TABLE public.commandes_2025_08 PARTITION OF public.commandes
  FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');

-- Table des historiques
CREATE TABLE public.historiques (
  id_historique SERIAL PRIMARY KEY,
  id_utilisateur INTEGER NOT NULL REFERENCES public.utilisateurs(id_utilisateur),
  pharmacies_consultes JSONB DEFAULT '[]'::jsonb,
  mes_commandes JSONB DEFAULT '[]'::jsonb
);

-- Table des notifications
CREATE TABLE public.notifications (
  id_notification SERIAL PRIMARY KEY,
  id_pharmacie INTEGER REFERENCES public.pharmacies(id_pharmacie),
  id_utilisateur INTEGER REFERENCES public.utilisateurs(id_utilisateur),
  type_notification VARCHAR NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table des produits
CREATE TABLE public.produits (
  id_produit SERIAL PRIMARY KEY,
  id_categorie INTEGER NOT NUL REFERENCES public.categories(id_categorie),
  libelle VARCHAR NOT NULL,
  description TEXT,
  unité VARCHAR 
  prix_unitaire NUMERIC NOT NULL CHECK (prix_unitaire >= 0),
  sur_ordonnance BOOLEAN NOT NULL
);

-- Indexes
CREATE INDEX idx_pharmacies_coordonnees ON public.pharmacies USING GIST (coordonnees);
CREATE INDEX idx_pharmacies_produits ON public.pharmacies USING GIN (produits);
CREATE INDEX idx_commandes_produits ON public.commandes USING GIN (produits);
CREATE INDEX idx_gardes_pharmacies_garde ON public.gardes USING GIN (pharmacies_garde);
CREATE INDEX idx_historiques_pharmacies_consultes ON public.historiques USING GIN (pharmacies_consultes);
CREATE INDEX idx_historiques_mes_commandes ON public.historiques USING GIN (mes_commandes);
CREATE INDEX idx_commandes_id_pharmacie ON public.commandes (id_pharmacie);
CREATE INDEX idx_commandes_id_utilisateur ON public.commandes (id_utilisateur);
CREATE INDEX idx_pharmaciens_id_pharmacie ON public.pharmaciens (id_pharmacie);
CREATE INDEX idx_utilisateurs_email ON public.utilisateurs (email);
CREATE INDEX idx_utilisateurs_telephone ON public.utilisateurs (telephone);
