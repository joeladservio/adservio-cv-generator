package com.adservio.cvgenerator.config;

import com.adservio.cvgenerator.model.*;
import com.adservio.cvgenerator.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(EmployeeRepository repository) {
        return args -> {
            // Définition des listes de données pour la génération aléatoire
            List<String> firstNames = Arrays.asList(
                "Thomas", "Marie", "Jean", "Sophie", "Pierre", 
                "Claire", "Lucas", "Emma", "Hugo", "Julie",
                "Antoine", "Léa", "Nicolas", "Sarah", "Alexandre",
                "Camille", "Maxime", "Chloé", "Louis", "Manon",
                "Paul", "Alice", "Gabriel", "Eva", "Arthur",
                "Inès", "Raphaël", "Zoé", "Victor", "Juliette"
            );
            
            List<String> lastNames = Arrays.asList(
                "Martin", "Bernard", "Dubois", "Robert", "Richard",
                "Petit", "Durand", "Leroy", "Moreau", "Simon",
                "Laurent", "Lefebvre", "Michel", "Garcia", "David",
                "Bertrand", "Roux", "Vincent", "Fournier", "Morel",
                "Girard", "Andre", "Mercier", "Dupont", "Lambert",
                "Bonnet", "Francois", "Martinez", "Legrand", "Garnier"
            );
            
            List<String> positions = Arrays.asList(
                "Développeur Full Stack", "Chef de Projet", "Architecte Solution",
                "DevOps Engineer", "Data Scientist", "UX/UI Designer",
                "Product Owner", "Scrum Master", "Business Analyst",
                "Tech Lead", "Software Engineer", "QA Engineer",
                "Cloud Architect", "Mobile Developer", "Frontend Developer"
            );
            
            List<String> departments = Arrays.asList(
                "IT", "R&D", "Innovation", "Digital", "Engineering",
                "Mobile", "Web", "Cloud", "Data", "Security",
                "DevOps", "QA", "Architecture", "Support", "Infrastructure"
            );

            // Création et sauvegarde de 30 employés
            for (int i = 0; i < 30; i++) {
                Employee employee = new Employee();
                employee.setFirstName(firstNames.get(i));
                employee.setLastName(lastNames.get(i));
                employee.setEmail(firstNames.get(i).toLowerCase() + "." + 
                                lastNames.get(i).toLowerCase() + "@adservio.fr");
                employee.setPhone("06" + String.format("%08d", i + 10000000));
                employee.setPosition(positions.get(i % positions.size()));
                employee.setDepartment(departments.get(i % departments.size()));
                
                // Génération de dates aléatoires
                LocalDate now = LocalDate.now();
                LocalDate birthDate = now.minusYears(25 + i % 20);
                LocalDate hireDate = now.minusYears(1 + i % 5);
                
                employee.setBirthDate(birthDate.format(DateTimeFormatter.ISO_DATE));
                employee.setHireDate(hireDate.format(DateTimeFormatter.ISO_DATE));
                employee.setContractType(i % 2 == 0 ? "CDI" : "CDD");
                employee.setSalary(35000.0 + (i * 1000));
                employee.setLevel(i % 5 == 0 ? "Junior" : i % 5 == 1 ? "Intermediaire" : i % 5 == 2 ? "Senior" : i % 5 == 3 ? "Expert" : "Manager");

                // Ajout de la formation
                List<Education> educationList = new ArrayList<>();
                educationList.add(new Education(
                    "Master en Informatique",
                    "Université Paris-Saclay",
                    2015 + (i % 5),
                    2017 + (i % 5),
                    "Spécialisation en développement logiciel et intelligence artificielle"
                ));
                employee.setEducationList(educationList);

                // Ajout de l'expérience
                List<Experience> experienceList = new ArrayList<>();
                experienceList.add(new Experience(
                    "Développeur Senior",
                    "Tech Solutions",
                    "2018-01",
                    "2021-12",
                    "Développement d'applications web et mobiles",
                    "Java, Spring Boot, Angular, React Native"
                ));
                employee.setExperienceList(experienceList);

                // Ajout des compétences
                List<Skill> skillsList = new ArrayList<>();
                skillsList.add(new Skill("Java", "Expert"));
                skillsList.add(new Skill("Spring Boot", "Avancé"));
                skillsList.add(new Skill("Angular", "Intermédiaire"));
                employee.setSkillsList(skillsList);

                // Ajout des langues
                List<Language> languagesList = new ArrayList<>();
                languagesList.add(new Language("Français", "Natif"));
                languagesList.add(new Language("Anglais", "C1"));
                employee.setLanguagesList(languagesList);

                // Ajout des certifications
                List<Certification> certificationsList = new ArrayList<>();
                certificationsList.add(new Certification(
                    "AWS Certified Developer",
                    "Amazon Web Services",
                    "2022-01-01",
                    "2025-01-01"
                ));
                employee.setCertificationsList(certificationsList);

                repository.save(employee);
            }
        };
    }
} 