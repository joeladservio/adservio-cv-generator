export interface Employee {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    education?: string;
    experience?: string;
    skills?: string;
    languages?: string;
    certifications?: string;
    photo?: string | File;
} 