import React from 'react';

const CertificateCard = ({ certificate }) => {
  return (
    <div className="certificate-card">
      <h4>{certificate.eventName}</h4>
      <p>Issued on: {new Date(certificate.issueDate).toLocaleDateString()}</p>
      <a href={certificate.viewLink} target="_blank" rel="noopener noreferrer">
        View Certificate
      </a>
    </div>
  );
};

export default CertificateCard;
