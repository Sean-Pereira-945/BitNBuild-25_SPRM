import React, { useState } from 'react';
import BlockchainVerifier from './BlockchainVerifier';

const CertificateVerifier = () => {
  const [certificateId, setCertificateId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = () => {
    // This would trigger the verification logic
    console.log('Verifying certificate:', certificateId);
    // Placeholder for result
    setVerificationResult("Verification in progress...");
  };

  return (
    <div>
      <h3>Verify a Certificate</h3>
      <input
        type="text"
        placeholder="Enter Certificate ID or Transaction Hash"
        value={certificateId}
        onChange={(e) => setCertificateId(e.target.value)}
      />
      <button onClick={handleVerify}>Verify</button>
      {verificationResult && <p>{verificationResult}</p>}
      <BlockchainVerifier certificateId={certificateId} setResult={setVerificationResult} />
    </div>
  );
};

export default CertificateVerifier;
