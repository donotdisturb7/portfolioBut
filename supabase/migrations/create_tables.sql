CREATE TABLE "utilisateurs" (
    "id" UUID REFERENCES auth.users PRIMARY KEY,
   "email" VARCHAR NOT NULL UNIQUE,
    "estEtudiant" BOOLEAN DEFAULT false,
    "dateCreation" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE profils (
    "idUtilisateur" UUID REFERENCES utilisateurs(id) PRIMARY KEY,
    "prenom"VARCHAR NOT NULL,
    "nom" VARCHAR NOT NULL,
    "anneePromotion" INTEGER,
    "avatar" VARCHAR,
    CONSTRAINT "annee_valide" CHECK ("anneePromotion" >= 2020 AND "anneePromotion" <= 2030)
);

CREATE TABLE "tutoriels" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "idUtilisateur" UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    "titre" VARCHAR NOT NULL,
    "contenu" TEXT NOT NULL,
    "categorie" VARCHAR NOT NULL,
    "dateCreation" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    "dateModification" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE "projet_utilisateurs" (
    "idProjet" UUID REFERENCES projets(id) ON DELETE CASCADE,
    "idUtilisateur" UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    "role" VARCHAR NOT NULL CHECK (role IN ('owner', 'contributor', 'viewer')),
    "dateAjout" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY ("idProjet", "idUtilisateur")
);

CREATE TABLE projets (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "titre" VARCHAR NOT NULL,
    "description" TEXT,
    "lienGithub" VARCHAR,
    "lienDemo" VARCHAR,
    "dateCreation" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    "dateModification" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

