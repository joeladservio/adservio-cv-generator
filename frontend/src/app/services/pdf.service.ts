import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';

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
                    image: employee.photo || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLXVzZXIiPjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIj48L3BhdGg+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ij48L2NpcmNsZT48L3N2Zz4=',
                    width: 150,
                    height: 150,
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                  },
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
                  }
                ]
              },
              {
                width: '70%',
                stack: [
                  {
                    text: 'Formation',
                    style: 'sectionHeader'
                  },
                  {
                    text: employee.education,
                    margin: [0, 5, 0, 15]
                  },
                  {
                    text: 'Expérience',
                    style: 'sectionHeader'
                  },
                  {
                    text: employee.experience,
                    margin: [0, 5, 0, 15]
                  },
                  {
                    text: 'Compétences',
                    style: 'sectionHeader'
                  },
                  {
                    text: employee.skills,
                    margin: [0, 5, 0, 15]
                  },
                  {
                    text: 'Langues',
                    style: 'sectionHeader'
                  },
                  {
                    text: employee.languages,
                    margin: [0, 5, 0, 15]
                  },
                  {
                    text: 'Certifications',
                    style: 'sectionHeader'
                  },
                  {
                    text: employee.certifications,
                    margin: [0, 5, 0, 15]
                  }
                ]
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