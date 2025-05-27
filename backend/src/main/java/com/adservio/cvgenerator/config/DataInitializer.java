package com.adservio.cvgenerator.config;

import com.adservio.cvgenerator.model.Employee;
import com.adservio.cvgenerator.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(EmployeeRepository repository) {
        return args -> {
            // Définition des listes de données pour la génération aléatoire
            List<String> firstNames = Arrays.asList("Thomas", "Marie", "Jean", "Sophie", "Pierre", "Claire", "Lucas", "Emma", "Hugo", "Julie");
            List<String> lastNames = Arrays.asList("Martin", "Bernard", "Dubois", "Robert", "Richard", "Petit", "Durand", "Leroy", "Moreau", "Simon");
            List<String> positions = Arrays.asList("Développeur Full Stack", "Chef de Projet", "Architecte Solution", "DevOps Engineer", "Data Scientist");
            List<String> departments = Arrays.asList("IT", "R&D", "Innovation", "Digital", "Engineering");
            List<String> educations = Arrays.asList(
                "Master en Informatique",
                "Diplôme d'Ingénieur",
                "Master en Science des Données",
                "Licence en Développement Web",
                "Master en Sécurité Informatique"
            );
            List<String> experiences = Arrays.asList(
                "5 ans d'expérience en développement Java/Spring",
                "3 ans en gestion de projets agiles",
                "7 ans en architecture logicielle",
                "4 ans en DevOps et Cloud Computing",
                "6 ans en développement Full Stack"
            );
            List<String> skillsList = Arrays.asList(
                "Java, Spring Boot, Angular, PostgreSQL",
                "Python, Django, React, MongoDB",
                "Docker, Kubernetes, AWS, CI/CD",
                "JavaScript, TypeScript, Node.js, Express",
                "Machine Learning, TensorFlow, Python, SQL"
            );
            List<String> languagesList = Arrays.asList(
                "Français (natif), Anglais (C1)",
                "Anglais (natif), Français (B2), Espagnol (B1)",
                "Français (natif), Anglais (B2), Allemand (B1)",
                "Anglais (C2), Français (C1)",
                "Français (natif), Anglais (C1), Arabe (B2)"
            );
            List<String> certificationsList = Arrays.asList(
                "AWS Certified Solutions Architect",
                "Certified Scrum Master",
                "Oracle Certified Professional Java SE 11",
                "Microsoft Certified: Azure Solutions Architect",
                "Google Cloud Professional Architect"
            );

            // Création et sauvegarde de 20 employés
            for (int i = 0; i < 20; i++) {
                Employee employee = new Employee();
                employee.setFirstName(firstNames.get(i % firstNames.size()));
                employee.setLastName(lastNames.get(i % lastNames.size()));
                employee.setEmail(firstNames.get(i % firstNames.size()).toLowerCase() + "." + 
                                lastNames.get(i % lastNames.size()).toLowerCase() + "@adservio.fr");
                employee.setPhone("06" + String.format("%08d", i + 10000000));
                employee.setPosition(positions.get(i % positions.size()));
                employee.setDepartment(departments.get(i % departments.size()));
                employee.setEducation(educations.get(i % educations.size()));
                employee.setExperience(experiences.get(i % experiences.size()));
                employee.setSkills(skillsList.get(i % skillsList.size()));
                employee.setLanguages(languagesList.get(i % languagesList.size()));
                employee.setCertifications(certificationsList.get(i % certificationsList.size()));

                repository.save(employee);
            }
        };
    }
} 