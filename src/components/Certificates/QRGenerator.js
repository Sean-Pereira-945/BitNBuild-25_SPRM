import React from 'react';
// You would need to install a library for this: npm install qrcode.react
import QRCode from 'qrcode.react';

const QRGenerator = ({ value }) => {
  if (!value) return null;

  return (
    <div style={{ background: 'white', padding: '16px' }}>
      <QRCode value={value} />
    </div>
  );
};

export default QRGenerator;
