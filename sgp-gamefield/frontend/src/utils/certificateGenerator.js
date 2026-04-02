import { jsPDF } from 'jspdf';

export const generateBadgeCertificate = (user, badge) => {
  const name = user?.name || 'Sustainable Farmer';
  const date = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Border
  doc.setDrawColor(16, 185, 129); // emerald-500
  doc.setLineWidth(5);
  doc.rect(5, 5, 287, 200);
  
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 277, 190);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59); // emerald-900
  doc.setFontSize(30);
  doc.text('CERTIFICATE OF ACHIEVEMENT', 148.5, 45, { align: 'center' });

  doc.setTextColor(5, 150, 105); // emerald-600
  doc.setFontSize(16);
  doc.text('VASUDHAARA: ANNADATA QUEST', 148.5, 55, { align: 'center' });

  // Body
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128); // gray-500
  doc.setFontSize(14);
  doc.text('This is to certify that', 148.5, 80, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39); // gray-900
  doc.setFontSize(40);
  doc.text(name.toUpperCase(), 148.5, 100, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(14);
  doc.text('has successfully unlocked the rank of', 148.5, 115, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // emerald-500
  doc.setFontSize(28);
  doc.text(badge.title.toUpperCase(), 148.5, 130, { align: 'center' });

  // XP Details
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(12);
  doc.text(`By earning over ${badge.xpThreshold} Experience Points within the platform.`, 148.5, 145, { align: 'center' });
  doc.text(`Current XP: ${user?.xp || 0}`, 148.5, 153, { align: 'center' });

  // Date
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.text(`Awarded on: ${date}`, 148.5, 175, { align: 'center' });
  
  // Seal
  doc.setFillColor(253, 230, 138); // yellow-200
  doc.circle(40, 160, 20, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(badge.icon, 40, 168, { align: 'center' });

  doc.save(`Vasudhaara_Certificate_${badge.title.replace(' ', '_')}.pdf`);
};
