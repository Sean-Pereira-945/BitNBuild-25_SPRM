import { useState } from 'react';
import Button from '../components/UI/Button';
import FormInput from '../components/UI/FormInput';
import './pages.css';

const VerificationPage = () => {
  const [badgeId, setBadgeId] = useState('');
  const [result, setResult] = useState(null);

  const handleVerify = (event) => {
    event.preventDefault();
    setResult({ status: 'pending', message: `Verification flow for ${badgeId} coming soon.` });
  };

  return (
    <section className="page" aria-labelledby="verification-heading">
      <header className="page__header">
        <h1 id="verification-heading">Verify NFT badge</h1>
        <p>Use badge IDs or QR codes to confirm blockchain authenticity in seconds.</p>
      </header>
      <form className="page__section" onSubmit={handleVerify}>
        <FormInput
          label="Badge ID"
          placeholder="Enter badge hash"
          value={badgeId}
          onChange={(event) => setBadgeId(event.target.value)}
          required
        />
        <Button type="submit">Verify</Button>
        {result && <p className="page__message">{result.message}</p>}
      </form>
    </section>
  );
};

export default VerificationPage;
