package com.adservio.cvgenerator.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "TEXT")
    private String firstName;
    
    @Column(columnDefinition = "TEXT")
    private String lastName;
    
    @Column(columnDefinition = "TEXT")
    private String email;
    
    @Column(columnDefinition = "TEXT")
    private String phone;
    
    @Column(columnDefinition = "TEXT")
    private String position;
    
    @Column(columnDefinition = "TEXT")
    private String department;
    
    @Column(columnDefinition = "TEXT")
    private String education;
    
    @Column(columnDefinition = "TEXT")
    private String experience;
    
    @Column(columnDefinition = "TEXT")
    private String skills;
    
    @Column(columnDefinition = "TEXT")
    private String languages;
    
    @Column(columnDefinition = "TEXT")
    private String certifications;
} 