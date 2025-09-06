'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface TimetableExporterProps {
  tableId: string;
  filename?: string;
  className?: string;
}

export const TimetableExporter = ({
  tableId,
  filename = 'timetable.pdf',
  className = '',
}: TimetableExporterProps) => {
  const exportToPdf = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      const element = document.getElementById(tableId);
      if (!element) {
        console.error('Timetable element not found');
        return;
      }
      
      // Create a style element to override all colors
      const style = document.createElement('style');
      style.textContent = `
        * {
          color: #000000 !important;
          background-color: #ffffff !important;
          background: #ffffff !important;
          border-color: #dddddd !important;
          box-shadow: none !important;
          text-shadow: none !important;
          filter: none !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Remove any oklch colors */
        *[style*="oklch"],
        *[style*="OKLCH"],
        *[style*="hsl"],
        *[style*="HSL"],
        *[style*="var("] {
          color: #000000 !important;
          background-color: #ffffff !important;
          background: #ffffff !important;
        }
      `;

      // Show loading state
      const button = document.activeElement as HTMLButtonElement;
      const originalText = button?.innerHTML;
      if (button) {
        button.disabled = true;
        button.innerHTML = 'Exporting...';
      }

      try {
        // Create a container for the export
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '0';
        container.style.top = '0';
        container.style.width = '1200px';
        container.style.zIndex = '9999';
        container.style.visibility = 'hidden';
        
        // Add the style overrides to the container
        container.appendChild(style);
        
        // Clone the element and its parent card for better context
        const card = element.closest('.overflow-hidden.rounded-lg.border');
        const clone = card ? card.cloneNode(true) as HTMLElement : element.cloneNode(true) as HTMLElement;
        
        // Function to convert any color to RGB
        const getComputedColor = (color: string) => {
          const div = document.createElement('div');
          div.style.color = color;
          document.body.appendChild(div);
          const computedColor = window.getComputedStyle(div).color;
          document.body.removeChild(div);
          return computedColor || '#000000';
        };

        // Clean up the clone
        const cleanElement = (el: HTMLElement) => {
          // Remove interactive elements
          const buttons = el.querySelectorAll('button, a, input, select, textarea');
          buttons.forEach(btn => btn.remove());
          
          // Get computed styles
          const styles = window.getComputedStyle(el);
          
          // Handle background colors
          const bgColor = styles.backgroundColor;
          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
            el.style.background = '#ffffff';
            el.style.backgroundColor = '#ffffff';
          }
          
          // Clean up other styles
          el.style.backgroundImage = 'none';
          el.style.boxShadow = 'none';
          el.style.textShadow = 'none';
          el.style.filter = 'none';
          
          // Process all child elements
          const elements = el.querySelectorAll('*');
          elements.forEach(childEl => {
            const htmlEl = childEl as HTMLElement;
            const childStyles = window.getComputedStyle(htmlEl);
            
            // Handle text color
            const textColor = childStyles.color;
            if (textColor) {
              try {
                htmlEl.style.color = getComputedColor(textColor);
              } catch (e) {
                htmlEl.style.color = '#000000';
              }
            }
            
            // Handle background colors
            const childBgColor = childStyles.backgroundColor;
            if (childBgColor && childBgColor !== 'rgba(0, 0, 0, 0)') {
              try {
                htmlEl.style.background = '#ffffff';
                htmlEl.style.backgroundColor = '#ffffff';
              } catch (e) {
                // Ignore errors for unsupported color formats
              }
            }
            
            // Clean up other styles
            htmlEl.style.backgroundImage = 'none';
            htmlEl.style.boxShadow = 'none';
            htmlEl.style.textShadow = 'none';
            htmlEl.style.filter = 'none';
          });
        };
        
        cleanElement(clone);
        container.appendChild(clone);
        document.body.appendChild(container);
        
        try {
          // Add a small delay to ensure all styles are applied
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Use html2canvas with simplified rendering
          const canvas = await html2canvas(clone, {
            scale: 1,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            allowTaint: true,
            foreignObjectRendering: false, // Disable foreignObject for better compatibility
            removeContainer: true,
            ignoreElements: (element) => {
              // Ignore any remaining interactive elements
              return ['button', 'a', 'input', 'select', 'textarea'].includes(element.tagName.toLowerCase());
            },
            onclone: (documentClone) => {
              // Force all text to be black for better visibility
              const allElements = documentClone.querySelectorAll('*');
              allElements.forEach(el => {
                const htmlEl = el as HTMLElement;
                htmlEl.style.color = '#000000';
                htmlEl.style.borderColor = '#dddddd';
              });
            }
          });

          // Create PDF
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
          });
          
          // Calculate dimensions to maintain aspect ratio
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(
            (pageWidth - 20) / imgWidth,
            (pageHeight - 20) / imgHeight
          );
          
          const finalWidth = imgWidth * ratio;
          const finalHeight = imgHeight * ratio;
          
          // Center the image on the page
          const x = (pageWidth - finalWidth) / 2;
          const y = 10; // 10mm from top
          
          pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
          
          // Add footer with timestamp
          const date = new Date().toLocaleString();
          pdf.setFontSize(10);
          pdf.setTextColor(100);
          pdf.text(
            `Generated on: ${date}`, 
            10, 
            pageHeight - 10
          );
          
          // Save the PDF
          pdf.save(filename);
          
        } finally {
          // Clean up
          if (container.parentNode) {
            container.parentNode.removeChild(container);
          }
        }
        
      } finally {
        // Restore button state
        if (button) {
          button.disabled = false;
          if (originalText) button.innerHTML = originalText;
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  return (
    <Button 
      onClick={exportToPdf}
      variant="outline"
      size="sm"
      className={`gap-1 ${className}`}
    >
      <Download className="h-4 w-4" />
      Export to PDF
    </Button>
  );
};
