import { Injectable } from '@angular/core';
import { Employee, Education, Experience, Skill, Language, Certification } from '../models/employee.model';

declare const pdfMake: any;
declare global {
  interface Window {
    pdfMake: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() {
    // S'assurer que pdfMake est disponible
    if (typeof window !== 'undefined') {
      window.pdfMake = window.pdfMake || {};
      window.pdfMake.vfs = window.pdfMake.vfs || {};
    }
  }

  generateCV(employee: Employee): void {
    try {
      const docDefinition = {
        content: [
          {
            columns: [
              {
                width: '30%',
                stack: [
                  {
                    text: `${employee.firstName} ${employee.lastName}`,
                    style: 'header',
                    alignment: 'center'
                  },
                  {
                    text: employee.position,
                    style: 'subheader',
                    alignment: 'center'
                  },
                  {
                    text: employee.department,
                    style: 'subheader',
                    alignment: 'center'
                  },
                  {
                    text: '\nContact',
                    style: 'sectionHeader'
                  },
                  {
                    text: `Email: ${employee.email}`,
                    margin: [0, 5, 0, 0]
                  },
                  {
                    text: `Téléphone: ${employee.phone}`,
                    margin: [0, 5, 0, 0]
                  },
                  employee.address ? {
                    text: `Adresse: ${employee.address}`,
                    margin: [0, 5, 0, 0]
                  } : null
                ].filter(item => item !== null)
              },
              {
                width: '70%',
                stack: [
                  // Formation
                  employee.educationList && employee.educationList.length > 0 ? [
                    {
                      text: 'Formation',
                      style: 'sectionHeader'
                    },
                    ...employee.educationList.map(edu => ({
                      text: [
                        `${edu.degree}\n`,
                        `${edu.school} (${edu.startYear} - ${edu.endYear})\n`,
                        edu.description ? `${edu.description}\n` : ''
                      ],
                      margin: [0, 5, 0, 15]
                    }))
                  ] : [],

                  // Expérience
                  employee.experienceList && employee.experienceList.length > 0 ? [
                    {
                      text: 'Expérience Professionnelle',
                      style: 'sectionHeader'
                    },
                    ...employee.experienceList.map(exp => ({
                      text: [
                        `${exp.title} - ${exp.company}\n`,
                        `${exp.startDate} - ${exp.endDate}\n`,
                        `${exp.description}\n`,
                        exp.technologies ? `Technologies: ${exp.technologies}\n` : ''
                      ],
                      margin: [0, 5, 0, 15]
                    }))
                  ] : [],

                  // Compétences
                  employee.skillsList && employee.skillsList.length > 0 ? [
                    {
                      text: 'Compétences',
                      style: 'sectionHeader'
                    },
                    {
                      table: {
                        widths: ['*', 'auto'],
                        body: [
                          ...employee.skillsList.map(skill => [
                            skill.name,
                            skill.level
                          ])
                        ]
                      },
                      layout: 'lightHorizontalLines',
                      margin: [0, 5, 0, 15]
                    }
                  ] : [],

                  // Langues
                  employee.languagesList && employee.languagesList.length > 0 ? [
                    {
                      text: 'Langues',
                      style: 'sectionHeader'
                    },
                    {
                      table: {
                        widths: ['*', 'auto'],
                        body: [
                          ...employee.languagesList.map(lang => [
                            lang.name,
                            lang.level
                          ])
                        ]
                      },
                      layout: 'lightHorizontalLines',
                      margin: [0, 5, 0, 15]
                    }
                  ] : [],

                  // Certifications
                  employee.certificationsList && employee.certificationsList.length > 0 ? [
                    {
                      text: 'Certifications',
                      style: 'sectionHeader'
                    },
                    ...employee.certificationsList.map(cert => ({
                      text: [
                        `${cert.name}\n`,
                        `${cert.organization}\n`,
                        `Obtenu le: ${cert.dateObtained}`,
                        cert.expiryDate ? ` - Expire le: ${cert.expiryDate}` : '',
                        '\n'
                      ],
                      margin: [0, 5, 0, 15]
                    }))
                  ] : []
                ].flat()
              }
            ]
          }
        ],
        styles: {
          header: {
            fontSize: 22,
            bold: true,
            margin: [0, 0, 0, 10],
            color: '#0d6efd'
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 0, 0, 5],
            color: '#6c757d'
          },
          sectionHeader: {
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 5],
            color: '#0d6efd',
            decoration: 'underline'
          }
        },
        defaultStyle: {
          fontSize: 12,
          lineHeight: 1.5
        },
        pageMargins: [40, 40, 40, 40],
        pageSize: 'A4'
      };

      // Créer et télécharger le PDF
      pdfMake.createPdf(docDefinition).download(`CV_${employee.firstName}_${employee.lastName}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
    }
  }
} 