package com.adservio.cvgenerator.integration;

import com.adservio.cvgenerator.model.Employee;
import com.adservio.cvgenerator.repository.EmployeeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class EmployeeIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Employee testEmployee;

    @BeforeEach
    void setUp() {
        employeeRepository.deleteAll();
        testEmployee = createTestEmployee(null); // ID will be generated
    }

    @Test
    void testCreateAndGetEmployee() throws Exception {
        // Create employee
        String response = mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testEmployee)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.firstName").value("John"))
            .andExpect(jsonPath("$.lastName").value("Doe"))
            .andExpect(jsonPath("$.email").value("john@example.com"))
            .andExpect(jsonPath("$.position").value("Developer"))
            .andReturn()
            .getResponse()
            .getContentAsString();

        Employee createdEmployee = objectMapper.readValue(response, Employee.class);

        // Get all employees
        mockMvc.perform(get("/api/employees"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].id").value(createdEmployee.getId()))
            .andExpect(jsonPath("$[0].firstName").value("John"))
            .andExpect(jsonPath("$[0].lastName").value("Doe"))
            .andExpect(jsonPath("$[0].email").value("john@example.com"));

        // Verify database state
        List<Employee> employees = employeeRepository.findAll();
        assertEquals(1, employees.size());
        assertEquals(createdEmployee.getId(), employees.get(0).getId());
    }

    @Test
    void testUpdateEmployee() throws Exception {
        // Create employee first
        Employee createdEmployee = employeeRepository.save(testEmployee);

        // Update employee
        createdEmployee.setFirstName("Jane");
        createdEmployee.setLastName("Smith");
        createdEmployee.setPosition("Senior Developer");
        createdEmployee.setSkills("Java, Spring, Angular");

        String response = mockMvc.perform(put("/api/employees/" + createdEmployee.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createdEmployee)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.firstName").value("Jane"))
            .andExpect(jsonPath("$.lastName").value("Smith"))
            .andExpect(jsonPath("$.position").value("Senior Developer"))
            .andExpect(jsonPath("$.skills").value("Java, Spring, Angular"))
            .andReturn()
            .getResponse()
            .getContentAsString();

        // Verify database state
        Employee updatedEmployee = employeeRepository.findById(createdEmployee.getId()).orElse(null);
        assertNotNull(updatedEmployee);
        assertEquals("Jane", updatedEmployee.getFirstName());
        assertEquals("Smith", updatedEmployee.getLastName());
        assertEquals("Senior Developer", updatedEmployee.getPosition());
    }

    @Test
    void testDeleteEmployee() throws Exception {
        // Create employee first
        Employee createdEmployee = employeeRepository.save(testEmployee);

        // Delete employee
        mockMvc.perform(delete("/api/employees/" + createdEmployee.getId()))
            .andExpect(status().isNoContent());

        // Verify employee is deleted
        mockMvc.perform(get("/api/employees/" + createdEmployee.getId()))
            .andExpect(status().isNotFound());

        // Verify database state
        assertFalse(employeeRepository.existsById(createdEmployee.getId()));
    }

    @Test
    void testGetEmployeeById() throws Exception {
        // Create employee first
        Employee createdEmployee = employeeRepository.save(testEmployee);

        // Get employee by id
        mockMvc.perform(get("/api/employees/" + createdEmployee.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(createdEmployee.getId()))
            .andExpect(jsonPath("$.firstName").value("John"))
            .andExpect(jsonPath("$.lastName").value("Doe"))
            .andExpect(jsonPath("$.email").value("john@example.com"))
            .andExpect(jsonPath("$.position").value("Developer"))
            .andExpect(jsonPath("$.department").value("IT"))
            .andExpect(jsonPath("$.skills").value("Java, Spring"));
    }

    @Test
    void testGetEmployeeByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/employees/999"))
            .andExpect(status().isNotFound());
    }

    @Test
    void testCreateEmployeeWithInvalidData() throws Exception {
        // Test with invalid email
        testEmployee.setEmail("invalid-email");
        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testEmployee)))
            .andExpect(status().isBadRequest());

        // Test with missing required fields
        Employee invalidEmployee = new Employee();
        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidEmployee)))
            .andExpect(status().isBadRequest());

        // Verify no employees were created
        assertEquals(0, employeeRepository.count());
    }

    @Test
    void testUpdateEmployeeWithInvalidData() throws Exception {
        // Create employee first
        Employee createdEmployee = employeeRepository.save(testEmployee);

        // Test with invalid email
        createdEmployee.setEmail("invalid-email");
        mockMvc.perform(put("/api/employees/" + createdEmployee.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createdEmployee)))
            .andExpect(status().isBadRequest());

        // Test with missing required fields
        Employee invalidEmployee = new Employee();
        invalidEmployee.setId(createdEmployee.getId());
        mockMvc.perform(put("/api/employees/" + createdEmployee.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidEmployee)))
            .andExpect(status().isBadRequest());

        // Verify the employee wasn't changed
        Employee unchangedEmployee = employeeRepository.findById(createdEmployee.getId()).orElse(null);
        assertNotNull(unchangedEmployee);
        assertEquals(testEmployee.getEmail(), unchangedEmployee.getEmail());
    }

    @Test
    void testConcurrentModification() throws Exception {
        // Create employee
        Employee createdEmployee = employeeRepository.save(testEmployee);

        // First update
        createdEmployee.setPosition("Senior Developer");
        mockMvc.perform(put("/api/employees/" + createdEmployee.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createdEmployee)))
            .andExpect(status().isOk());

        // Concurrent update with old data
        testEmployee.setPosition("Team Lead");
        mockMvc.perform(put("/api/employees/" + createdEmployee.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testEmployee)))
            .andExpect(status().isOk());

        // Verify final state
        Employee finalEmployee = employeeRepository.findById(createdEmployee.getId()).orElse(null);
        assertNotNull(finalEmployee);
        assertEquals("Team Lead", finalEmployee.getPosition());
    }

    private Employee createTestEmployee(Long id) {
        Employee employee = new Employee();
        employee.setId(id);
        employee.setFirstName("John");
        employee.setLastName("Doe");
        employee.setEmail("john@example.com");
        employee.setPhone("1234567890");
        employee.setPosition("Developer");
        employee.setDepartment("IT");
        employee.setEducation("Bachelor in CS");
        employee.setExperience("5 years");
        employee.setSkills("Java, Spring");
        employee.setLanguages("English, French");
        employee.setCertifications("AWS Certified");
        return employee;
    }
} 