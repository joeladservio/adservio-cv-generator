package com.adservio.cvgenerator.service;

import com.adservio.cvgenerator.model.Employee;
import com.adservio.cvgenerator.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$";
    private static final Pattern pattern = Pattern.compile(EMAIL_PATTERN);

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public Employee createEmployee(Employee employee) {
        validateEmployee(employee);
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee employeeDetails) {
        validateEmployee(employeeDetails);
        
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found with id: " + id));

        employee.setFirstName(employeeDetails.getFirstName());
        employee.setLastName(employeeDetails.getLastName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setPhone(employeeDetails.getPhone());
        employee.setPosition(employeeDetails.getPosition());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setEducation(employeeDetails.getEducation());
        employee.setExperience(employeeDetails.getExperience());
        employee.setSkills(employeeDetails.getSkills());
        employee.setLanguages(employeeDetails.getLanguages());
        employee.setCertifications(employeeDetails.getCertifications());

        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found with id: " + id));
        employeeRepository.deleteById(id);
    }

    private void validateEmployee(Employee employee) {
        StringBuilder errors = new StringBuilder();
        
        if (employee.getFirstName() == null || employee.getFirstName().trim().isEmpty()) {
            errors.append("Le prénom est obligatoire. ");
        }
        if (employee.getLastName() == null || employee.getLastName().trim().isEmpty()) {
            errors.append("Le nom est obligatoire. ");
        }
        if (employee.getEmail() == null || employee.getEmail().trim().isEmpty()) {
            errors.append("L'email est obligatoire. ");
        } else if (!isValidEmail(employee.getEmail())) {
            errors.append("Format d'email invalide. ");
        }
        if (employee.getPhone() == null || employee.getPhone().trim().isEmpty()) {
            errors.append("Le numéro de téléphone est obligatoire. ");
        } else if (!employee.getPhone().matches("^[0-9]{10}$")) {
            errors.append("Le numéro de téléphone doit contenir 10 chiffres. ");
        }
        if (employee.getPosition() == null || employee.getPosition().trim().isEmpty()) {
            errors.append("Le poste est obligatoire. ");
        }
        if (employee.getDepartment() == null || employee.getDepartment().trim().isEmpty()) {
            errors.append("Le département est obligatoire. ");
        }

        if (errors.length() > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errors.toString().trim());
        }
    }

    private boolean isValidEmail(String email) {
        return pattern.matcher(email).matches();
    }
} 