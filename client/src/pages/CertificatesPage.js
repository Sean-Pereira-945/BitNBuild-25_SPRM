/**
 * CertificatesPage - Display user's certificate collection
 */
import React from 'react';

const CertificatesPage = () => {
  // Mock certificates data
  const certificates = [
    {
      id: '1',
      eventTitle: 'React Conference 2025',
      issueDate: '2025-10-15',
      organizerName: 'Tech Events Inc.',
      blockchainHash: '0x1234567890abcdef...',
      certificateType: 'Attendance',
      verified: true
    },
    {
      id: '2',
      eventTitle: 'Web3 Workshop',
      issueDate: '2025-09-20',
      organizerName: 'Blockchain Academy',
      blockchainHash: '0xabcdef1234567890...',
      certificateType: 'Completion',
      verified: true
    }
  ];

  const handleShareToLinkedIn = (certificate) => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      `https://eventchain.app/certificate/${certificate.id}`
    )}&title=${encodeURIComponent(
      `I just earned a verified certificate for attending ${certificate.eventTitle}!`
    )}`;
    
    window.open(shareUrl, '_blank', 'width=600,height=600');
  };

  return (
    <div className="container">
      <h1>My Certificates</h1>
      <p className="text-secondary">
        Your verified blockchain certificates from attended events
      </p>

      {certificates.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          border: '1px dashed var(--border-primary)',
          borderRadius: 'var(--radius-lg)',
          marginTop: '2rem'
        }}>
          <h3>No Certificates Yet</h3>
          <p className="text-secondary">
            Attend events to start building your certificate collection
          </p>
          <a 
            href="/events"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--primary-600)',
              color: 'white',
              borderRadius: 'var(--radius-base)',
              textDecoration: 'none'
            }}
          >
            Browse Events
          </a>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {certificates.map(certificate => (
            <div 
              key={certificate.id}
              style={{
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                backgroundColor: 'var(--bg-elevated)',
                position: 'relative'
              }}
            >
              {/* Verified Badge */}
              {certificate.verified && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: 'var(--success-100)',
                  color: 'var(--success-800)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  ✓ Verified
                </div>
              )}

              <h3 style={{ marginBottom: '0.5rem', marginRight: '4rem' }}>
                {certificate.eventTitle}
              </h3>
              
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <p>🎓 {certificate.certificateType} Certificate</p>
                <p>🏢 Issued by {certificate.organizerName}</p>
                <p>📅 {new Date(certificate.issueDate).toLocaleDateString()}</p>
                <p style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  🔗 {certificate.blockchainHash}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleShareToLinkedIn(certificate)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#0077b5',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-base)',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Share on LinkedIn
                </button>
                
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    color: 'var(--primary-600)',
                    border: '1px solid var(--primary-600)',
                    borderRadius: 'var(--radius-base)',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  View Details
                </button>
                
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: 'var(--radius-base)',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <section style={{ 
        marginTop: '3rem', 
        padding: '2rem', 
        backgroundColor: 'var(--bg-secondary)', 
        borderRadius: 'var(--radius-lg)'
      }}>
        <h3>About Your Certificates</h3>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            All certificates are stored on the blockchain and are tamper-proof
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Anyone can verify your certificates using the blockchain hash
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Share directly to LinkedIn, Twitter, or other professional platforms
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Download PDF versions for your portfolio or applications
          </li>
        </ul>
      </section>
    </div>
  );
};

export default CertificatesPage;