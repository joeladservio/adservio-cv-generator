package com.adservio.cvgenerator.integration;

import com.adservio.cvgenerator.CvGeneratorApplication;
import com.adservio.cvgenerator.model.Employee;
import com.adservio.cvgenerator.repository.EmployeeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(
    classes = CvGeneratorApplication.class,
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
class EmployeeIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        employeeRepository.deleteAll();
    }

    @Test
    void createEmployee_WithValidData_ShouldSucceed() throws Exception {
        // Given
        Employee employee = createTestEmployee();
        String employeeJson = objectMapper.writeValueAsString(employee);

        // When
        MvcResult result = mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(employeeJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.firstName").value(employee.getFirstName()))
                .andExpect(jsonPath("$.lastName").value(employee.getLastName()))
                .andExpect(jsonPath("$.email").value(employee.getEmail()))
                .andReturn();

        // Then
        String responseJson = result.getResponse().getContentAsString();
        Employee createdEmployee = objectMapper.readValue(responseJson, Employee.class);
        assertNotNull(createdEmployee.getId());
        assertTrue(employeeRepository.findById(createdEmployee.getId()).isPresent());
    }

    @Test
    void createEmployee_WithInvalidData_ShouldFail() throws Exception {
        // Given
        Employee invalidEmployee = new Employee(); // Empty employee
        String employeeJson = objectMapper.writeValueAsString(invalidEmployee);

        // When/Then
        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(employeeJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateEmployee_WithValidData_ShouldSucceed() throws Exception {
        // Given
        Employee existingEmployee = employeeRepository.save(createTestEmployee());
        existingEmployee.setFirstName("Updated");
        existingEmployee.setPosition("Senior Developer");
        String updateJson = objectMapper.writeValueAsString(existingEmployee);

        // When
        MvcResult result = mockMvc.perform(put("/api/employees/{id}", existingEmployee.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(existingEmployee.getId()))
                .andExpect(jsonPath("$.firstName").value("Updated"))
                .andExpect(jsonPath("$.position").value("Senior Developer"))
                .andReturn();

        // Then
        String responseJson = result.getResponse().getContentAsString();
        Employee updatedEmployee = objectMapper.readValue(responseJson, Employee.class);
        assertEquals("Updated", updatedEmployee.getFirstName());
        assertEquals("Senior Developer", updatedEmployee.getPosition());

        // Verify in database
        Employee savedEmployee = employeeRepository.findById(existingEmployee.getId())
                .orElseThrow();
        assertEquals("Updated", savedEmployee.getFirstName());
        assertEquals("Senior Developer", savedEmployee.getPosition());
    }

    @Test
    void updateEmployee_WithNonExistingId_ShouldFail() throws Exception {
        // Given
        Employee updateData = createTestEmployee();
        String updateJson = objectMapper.writeValueAsString(updateData);

        // When/Then
        mockMvc.perform(put("/api/employees/{id}", 999L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
                .andExpect(status().isNotFound());
    }

    @Test
    void getEmployeeById_WhenExists_ShouldSucceed() throws Exception {
        // Given
        Employee employee = employeeRepository.save(createTestEmployee());

        // When/Then
        mockMvc.perform(get("/api/employees/{id}", employee.getId()))
                .andExpect(status().isOk());
    }

    @Test
    void getEmployeeById_WhenNotExists_ShouldReturn404() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/employees/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAllEmployees_ShouldSucceed() throws Exception {
        // Given
        employeeRepository.save(createTestEmployee());

        // When/Then
        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk());
    }

    @Test
    void deleteEmployee_WhenExists_ShouldSucceed() throws Exception {
        // Given
        Employee savedEmployee = employeeRepository.save(createTestEmployee());

        // When/Then
        mockMvc.perform(delete("/api/employees/{id}", savedEmployee.getId()))
                .andExpect(status().isNoContent());
    }

    private Employee createTestEmployee() {
        Employee employee = new Employee();
        employee.setFirstName("John");
        employee.setLastName("Doe");
        employee.setEmail("john.doe@example.com");
        employee.setPhone("+1234567890");
        employee.setPosition("Software Engineer");
        employee.setDepartment("Engineering");
        return employee;
    }
} 