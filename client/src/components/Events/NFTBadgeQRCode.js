import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import PropTypes from 'prop-types';

const NFTBadgeQRCode = ({ eventId, badgeUrl }) => {
  const url = badgeUrl || `${window.location.origin}/badges/${eventId}`;
  return (
    <div style={{ textAlign: 'center', margin: '1rem 0' }}>
      <QRCodeCanvas value={url} size={192} level="H" includeMargin={true} />
      <div style={{ marginTop: 8 }}>
        <a href={url} target="_blank" rel="noopener noreferrer">View NFT Badge</a>
      </div>
    </div>
  );
};

NFTBadgeQRCode.propTypes = {
  eventId: PropTypes.string.isRequired,
  badgeUrl: PropTypes.string,
};

export default NFTBadgeQRCode;
