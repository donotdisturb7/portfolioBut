CREATE TABLE ressources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titre VARCHAR NOT NULL,
    description TEXT,
    type VARCHAR NOT NULL CHECK (type IN ('article', 'video', 'cours', 'outil')),
    url VARCHAR NOT NULL,
    image_url VARCHAR,
    dateCreation TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    dateModification TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
