package com.adservio.cvgenerator.controller;

import com.adservio.cvgenerator.model.Employee;
import com.adservio.cvgenerator.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:4200")
public class EmployeeController {
    private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);
    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id)
            .map(employee -> new ResponseEntity<>(employee, HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        try {
            logger.info("Tentative de création d'un employé: {}", employee);
            Employee createdEmployee = employeeService.createEmployee(employee);
            logger.info("Employé créé avec succès: {}", createdEmployee);
            return new ResponseEntity<>(createdEmployee, HttpStatus.CREATED);
        } catch (ResponseStatusException e) {
            logger.error("Erreur de validation lors de la création: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Erreur inattendue lors de la création: ", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Données invalides: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
        try {
            logger.info("Tentative de mise à jour de l'employé {} avec les données: {}", id, employee);
            Employee updatedEmployee = employeeService.updateEmployee(id, employee);
            logger.info("Employé mis à jour avec succès: {}", updatedEmployee);
            return new ResponseEntity<>(updatedEmployee, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            logger.error("Erreur de validation lors de la mise à jour: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Erreur inattendue lors de la mise à jour: ", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Données invalides: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        try {
            logger.info("Tentative de suppression de l'employé {}", id);
            employeeService.deleteEmployee(id);
            logger.info("Employé {} supprimé avec succès", id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (ResponseStatusException e) {
            logger.error("Erreur lors de la suppression: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Erreur inattendue lors de la suppression: ", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID employé invalide");
        }
    }
} 