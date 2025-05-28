package com.adservio.cvgenerator.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Education {
    private String degree;
    private String school;
    private Integer startYear;
    private Integer endYear;
    private String description;
} 