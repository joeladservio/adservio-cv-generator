-- Supprimer la table flyway_schema_history
DROP TABLE IF EXISTS flyway_schema_history;

-- Supprimer les tables existantes pour permettre à JPA de les recréer
DROP TABLE IF EXISTS employee_certifications;
DROP TABLE IF EXISTS employee_languages;
DROP TABLE IF EXISTS employee_skills;
DROP TABLE IF EXISTS employee_experience;
DROP TABLE IF EXISTS employee_education;
DROP TABLE IF EXISTS employee; 