-- Drop existing policies
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir tous les profils" ON "utilisateurs";
DROP POLICY IF EXISTS "Les utilisateurs peuvent créer leur profil lors de l'inscription" ON "utilisateurs";
DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leur propre profil" ON "utilisateurs";
DROP POLICY IF EXISTS "Permettre l'inscription sans authentification" ON "utilisateurs";
DROP POLICY IF EXISTS "Enable read access for all users" ON "utilisateurs";
DROP POLICY IF EXISTS "Enable insert for anyone" ON "utilisateurs";
DROP POLICY IF EXISTS "Enable update for users based on id" ON "utilisateurs";

-- Disable RLS temporarily
ALTER TABLE "utilisateurs" DISABLE ROW LEVEL SECURITY;

-- Enable RLS again
ALTER TABLE "utilisateurs" ENABLE ROW LEVEL SECURITY;

-- Supprimer toutes les policies existantes pour utilisateurs
DROP POLICY IF EXISTS "Permettre la lecture pour tous les utilisateurs" ON "utilisateurs";
DROP POLICY IF EXISTS "Permettre l'insertion pour tous" ON "utilisateurs";
DROP POLICY IF EXISTS "Permettre la mise à jour de son propre profil" ON "utilisateurs";

-- Supprimer toutes les policies existantes pour profils
DROP POLICY IF EXISTS "Permettre la lecture des profils pour tous" ON "profils";
DROP POLICY IF EXISTS "Permettre la création de profil pour tous" ON "profils";
DROP POLICY IF EXISTS "Permettre la mise à jour de son propre profil étudiant" ON "profils";

-- Activer RLS sur les tables
ALTER TABLE "utilisateurs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profils" ENABLE ROW LEVEL SECURITY;

-- Ajouter la contrainte d'année
ALTER TABLE "profils" DROP CONSTRAINT IF EXISTS "annee_valide";
ALTER TABLE "profils" ADD CONSTRAINT "annee_valide" 
    CHECK ("anneePromotion" >= 2020 AND "anneePromotion" <= 2030);

-- Policies pour utilisateurs
CREATE POLICY "Permettre la lecture pour tous les utilisateurs"
    ON "utilisateurs"
    FOR SELECT
    USING (true);

CREATE POLICY "Permettre l'insertion pour tous"
    ON "utilisateurs"
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permettre la mise à jour de son propre profil"
    ON "utilisateurs"
    FOR UPDATE
    USING (auth.uid() = id);

-- Policies pour profils
CREATE POLICY "Permettre la lecture des profils pour tous"
    ON "profils"
    FOR SELECT
    USING (true);

CREATE POLICY "Permettre la création de profil pour tous"
    ON "profils"
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permettre la mise à jour de son propre profil étudiant"
    ON "profils"
    FOR UPDATE
    USING (auth.uid() = "idUtilisateur");

-- Permettre l'accès public à la table utilisateurs
ALTER TABLE "utilisateurs" FORCE ROW LEVEL SECURITY;
ALTER TABLE "utilisateurs" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

-- Donner les permissions nécessaires
GRANT INSERT ON "utilisateurs" TO anon;
GRANT SELECT ON "utilisateurs" TO anon;
GRANT UPDATE ON "utilisateurs" TO authenticated;
