package com.adservio.cvgenerator.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Certification {
    private String name;
    private String organization;
    private String dateObtained;
    private String expiryDate;
} 