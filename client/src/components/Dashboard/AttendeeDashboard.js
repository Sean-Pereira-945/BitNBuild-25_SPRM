import React from 'react';
import CertificateCard from '../Certificates/CertificateCard';

// Mock data
const mockCertificates = [
    { id: 1, eventName: 'Web3 Conference 2024', issueDate: '2024-10-26', viewLink: '#' },
    { id: 2, eventName: 'React Summit', issueDate: '2024-08-15', viewLink: '#' },
];

const AttendeeDashboard = () => {
  return (
    <div>
      <h2>Attendee Dashboard</h2>
      <h3>My Certificates</h3>
      <div>
        {mockCertificates.map(cert => (
          <CertificateCard key={cert.id} certificate={cert} />
        ))}
      </div>
      {/* List of upcoming events the user is registered for */}
    </div>
  );
};

export default AttendeeDashboard;
