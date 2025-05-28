package com.adservio.cvgenerator.service;

import com.adservio.cvgenerator.model.*;
import com.adservio.cvgenerator.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.adservio.cvgenerator.exception.ResourceNotFoundException;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$";
    private static final Pattern pattern = Pattern.compile(EMAIL_PATTERN);

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

    public Employee updateEmployee(Long id, Employee employee) {
        validateEmployee(employee);
        
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        updateEmployeeFields(existingEmployee, employee);
        return employeeRepository.save(existingEmployee);
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

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found with id: " + id));
        
        employeeRepository.deleteById(id);
    }

    public byte[] generateCV(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try {
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();
            
            // Styles
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, BaseColor.DARK_GRAY);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new BaseColor(0, 102, 204));
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 11, BaseColor.BLACK);
            Font italicFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 11, BaseColor.DARK_GRAY);

            // En-tête
            Paragraph header = new Paragraph();
            header.add(new Phrase(employee.getFirstName() + " " + employee.getLastName(), titleFont));
            header.setAlignment(Element.ALIGN_CENTER);
            header.setSpacingAfter(10);
            document.add(header);

            // Poste actuel
            Paragraph position = new Paragraph(employee.getPosition(), italicFont);
            position.setAlignment(Element.ALIGN_CENTER);
            position.setSpacingAfter(20);
            document.add(position);
            
            // Informations de contact
            addSection(document, "INFORMATIONS DE CONTACT", sectionFont);
            addContactInfo(document, employee, normalFont);
            
            // Formation
            if (employee.getEducationList() != null && !employee.getEducationList().isEmpty()) {
                addSection(document, "FORMATION", sectionFont);
                for (Education edu : employee.getEducationList()) {
                    addEducationEntry(document, edu, normalFont);
                }
            }
            
            // Expérience
            if (employee.getExperienceList() != null && !employee.getExperienceList().isEmpty()) {
                addSection(document, "EXPÉRIENCE PROFESSIONNELLE", sectionFont);
                for (Experience exp : employee.getExperienceList()) {
                    addExperienceEntry(document, exp, normalFont);
                }
            }
            
            // Compétences
            if (employee.getSkillsList() != null && !employee.getSkillsList().isEmpty()) {
                addSection(document, "COMPÉTENCES", sectionFont);
                addSkillsTable(document, employee.getSkillsList(), normalFont);
            }
            
            // Langues
            if (employee.getLanguagesList() != null && !employee.getLanguagesList().isEmpty()) {
                addSection(document, "LANGUES", sectionFont);
                addLanguagesTable(document, employee.getLanguagesList(), normalFont);
            }
            
            // Certifications
            if (employee.getCertificationsList() != null && !employee.getCertificationsList().isEmpty()) {
                addSection(document, "CERTIFICATIONS", sectionFont);
                for (Certification cert : employee.getCertificationsList()) {
                    addCertificationEntry(document, cert, normalFont);
                }
            }
            
            document.close();
            return baos.toByteArray();
            
        } catch (DocumentException e) {
            throw new RuntimeException("Erreur lors de la génération du CV", e);
        }
    }

    private void addSection(Document document, String title, Font font) throws DocumentException {
        Paragraph section = new Paragraph(title, font);
        section.setSpacingBefore(15);
        section.setSpacingAfter(10);
        document.add(section);
        
        LineSeparator line = new LineSeparator();
        line.setLineColor(new BaseColor(0, 102, 204));
        document.add(line);
    }

    private void addContactInfo(Document document, Employee employee, Font font) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(15);

        addTableRow(table, "Email:", employee.getEmail(), font);
        addTableRow(table, "Téléphone:", employee.getPhone(), font);
        addTableRow(table, "Département:", employee.getDepartment(), font);
        if (employee.getAddress() != null) {
            addTableRow(table, "Adresse:", employee.getAddress(), font);
        }

        document.add(table);
    }

    private void addTableRow(PdfPTable table, String label, String value, Font font) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, font));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        
        PdfPCell valueCell = new PdfPCell(new Phrase(value, font));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        
        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private void addEducationEntry(Document document, Education education, Font font) throws DocumentException {
        Paragraph entry = new Paragraph();
        entry.setIndentationLeft(20);
        entry.setSpacingBefore(5);
        entry.setSpacingAfter(10);
        
        entry.add(new Chunk(education.getDegree() + "\n", font));
        entry.add(new Chunk(education.getSchool() + " (" + education.getStartYear() + " - " + education.getEndYear() + ")\n", font));
        if (education.getDescription() != null && !education.getDescription().isEmpty()) {
            entry.add(new Chunk(education.getDescription(), font));
        }
        
        document.add(entry);
    }

    private void addExperienceEntry(Document document, Experience experience, Font font) throws DocumentException {
        Paragraph entry = new Paragraph();
        entry.setIndentationLeft(20);
        entry.setSpacingBefore(5);
        entry.setSpacingAfter(10);
        
        entry.add(new Chunk(experience.getTitle() + " - " + experience.getCompany() + "\n", font));
        entry.add(new Chunk(experience.getStartDate() + " - " + experience.getEndDate() + "\n", font));
        entry.add(new Chunk(experience.getDescription() + "\n", font));
        if (experience.getTechnologies() != null && !experience.getTechnologies().isEmpty()) {
            entry.add(new Chunk("Technologies: " + experience.getTechnologies(), font));
        }
        
        document.add(entry);
    }

    private void addSkillsTable(Document document, List<Skill> skills, Font font) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(15);

        for (Skill skill : skills) {
            addTableRow(table, skill.getName() + ":", skill.getLevel(), font);
        }

        document.add(table);
    }

    private void addLanguagesTable(Document document, List<Language> languages, Font font) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(15);

        for (Language language : languages) {
            addTableRow(table, language.getName() + ":", language.getLevel(), font);
        }

        document.add(table);
    }

    private void addCertificationEntry(Document document, Certification certification, Font font) throws DocumentException {
        Paragraph entry = new Paragraph();
        entry.setIndentationLeft(20);
        entry.setSpacingBefore(5);
        entry.setSpacingAfter(10);
        
        entry.add(new Chunk(certification.getName() + "\n", font));
        entry.add(new Chunk(certification.getOrganization() + "\n", font));
        entry.add(new Chunk("Obtenu le: " + certification.getDateObtained(), font));
        if (certification.getExpiryDate() != null && !certification.getExpiryDate().isEmpty()) {
            entry.add(new Chunk(" - Expire le: " + certification.getExpiryDate(), font));
        }
        
        document.add(entry);
    }

    private void updateEmployeeFields(Employee existingEmployee, Employee employee) {
        existingEmployee.setFirstName(employee.getFirstName());
        existingEmployee.setLastName(employee.getLastName());
        existingEmployee.setEmail(employee.getEmail());
        existingEmployee.setPhone(employee.getPhone());
        existingEmployee.setBirthDate(employee.getBirthDate());
        existingEmployee.setBirthPlace(employee.getBirthPlace());
        existingEmployee.setAddress(employee.getAddress());
        existingEmployee.setPosition(employee.getPosition());
        existingEmployee.setDepartment(employee.getDepartment());
        existingEmployee.setHireDate(employee.getHireDate());
        existingEmployee.setContractType(employee.getContractType());
        existingEmployee.setSalary(employee.getSalary());
        existingEmployee.setLevel(employee.getLevel());
        existingEmployee.setEducationList(employee.getEducationList());
        existingEmployee.setExperienceList(employee.getExperienceList());
        existingEmployee.setSkillsList(employee.getSkillsList());
        existingEmployee.setLanguagesList(employee.getLanguagesList());
        existingEmployee.setCertificationsList(employee.getCertificationsList());
    }
} 