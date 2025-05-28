package com.adservio.cvgenerator.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String phone;
    
    private String birthDate;
    
    private String birthPlace;
    
    private String address;
    
    @Column(nullable = false)
    private String position;
    
    @Column(nullable = false)
    private String department;
    
    private String hireDate;
    
    private String contractType;
    
    private Double salary;
    
    private String level;
    
    @ElementCollection
    @CollectionTable(name = "employee_education")
    private List<Education> educationList;
    
    @ElementCollection
    @CollectionTable(name = "employee_experience")
    private List<Experience> experienceList;
    
    @ElementCollection
    @CollectionTable(name = "employee_skills")
    private List<Skill> skillsList;
    
    @ElementCollection
    @CollectionTable(name = "employee_languages")
    private List<Language> languagesList;
    
    @ElementCollection
    @CollectionTable(name = "employee_certifications")
    private List<Certification> certificationsList;
} 