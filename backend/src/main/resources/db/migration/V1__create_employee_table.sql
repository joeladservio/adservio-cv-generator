CREATE TABLE employee (
    id BIGSERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT NOT NULL,
    education TEXT,
    experience TEXT,
    skills TEXT,
    languages TEXT,
    certifications TEXT
); 