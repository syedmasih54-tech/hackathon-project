/**
 * calendar.js
 * Generates and downloads a standard iCalendar (.ics) event file
 * for 21-day grievance follow-up reminder.
 */

export function downloadGrievanceReminderIcs({
  registrationNumber = '',
  schemeName = 'Widow Pension Grievance',
  daysAhead = 21
}) {
  const now = new Date();
  const eventDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  function formatDate(d) {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  const dtStart = formatDate(eventDate);
  const dtEnd = formatDate(new Date(eventDate.getTime() + 60 * 60 * 1000));
  const dtStamp = formatDate(now);
  const uid = `bb-grievance-${Date.now()}@benefitbridge.org`;

  const summary = `BenefitBridge: Follow-up on Grievance #${registrationNumber || 'Pension'}`;
  const description = `21-day follow-up checkpoint for your grievance registered on pgportal.gov.in.\\nScheme: ${schemeName}\\nRegistration No: ${registrationNumber || 'N/A'}\\nAction: Check status on CPGRAMS portal (https://pgportal.gov.in/Status).`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BenefitBridge//Grievance Reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Check BenefitBridge grievance status',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `BenefitBridge-Reminder-21Days.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
