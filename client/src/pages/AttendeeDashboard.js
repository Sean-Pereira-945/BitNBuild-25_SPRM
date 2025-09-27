import { useEffect, useMemo, useRef, useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import Button from '../components/UI/Button';
import FormInput from '../components/UI/FormInput';
import Modal from '../components/UI/Modal';
import useAuth from '../hooks/useAuth';
import { useNotifications } from '../context/NotificationContext';
import * as authService from '../services/authService';
import { parseAPIError } from '../utils/errorHandling';
import './pages.css';

const AttendeeDashboard = () => (
  <Routes>
    <Route index element={<AttendeeOverview />} />
    <Route path="events" element={<DiscoveryHub />} />
    <Route path="scanner" element={<QrScannerCenter />} />
    <Route path="collection" element={<CollectionGallery />} />
    <Route path="social" element={<SocialPulse />} />
    <Route path="*" element={<Navigate to="." replace />} />
  </Routes>
);

const AttendeeOverview = () => {
  const { user } = useAuth();
  return (
    <section className="page" aria-labelledby="attendee-overview-heading">
      <header className="page__header">
        <h1 id="attendee-overview-heading">Hey {user?.name?.split(' ')[0] || 'there'} 👋</h1>
        <p>Discover new events, verify your attendance, and grow your on-chain reputation with collectible NFTs.</p>
      </header>
      <div className="page__content page__grid">
        <FeatureCard
          title="Explore events"
          description="Find public events, RSVP to private drops, and secure your spot before capacity fills."
          ctaLabel="Browse events"
          to="events"
        />
        <FeatureCard
          title="Scan QR badges"
          description="Claim your NFT badges on-site with geo-verified QR scans and instant blockchain confirmation."
          ctaLabel="Open scanner"
          to="scanner"
        />
        <FeatureCard
          title="Showcase NFTs"
          description="Curate your badge collection, share proof-of-attendance, and unlock sharable QR certificates."
          ctaLabel="View collection"
          to="collection"
        />
        <FeatureCard
          title="Stay in the loop"
          description="Follow organizers, enable push notifications, and receive tailored event recommendations."
          ctaLabel="Manage alerts"
          to="social"
        />
      </div>
    </section>
  );
};

const DiscoveryHub = () => (
  <section className="page" aria-labelledby="discovery-heading">
    <header className="page__header">
      <h1 id="discovery-heading">Event discovery</h1>
      <p>Filter by date, category, chain, or proximity to build your perfect IRL or virtual event itinerary.</p>
    </header>
    <div className="page__content">
      <DashboardSection
        title="Find your next adventure"
        items={[
          'Browse curated public events with live capacity indicators and entry fees.',
          'Unlock private invitations tied to your wallet, POAP history, or organizer follow lists.',
          'Search by tags, entry fee, or POAP rarity to capture the badges you value most.',
          'Queue enrollment with crypto or fiat payments thanks to integrated wallet providers.'
        ]}
      />
      <Button as={Link} to="/events" variant="primary">
        Jump to event explorer
      </Button>
    </div>
  </section>
);

const QrScannerCenter = () => {
  const { showNotification } = useNotifications();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      payload: '',
    },
  });

  useEffect(() => {
    const videoElement = videoRef.current;

    const enableCamera = async () => {
      if (!isScannerOpen || streamRef.current) return;
      if (!navigator.mediaDevices?.getUserMedia) {
        showNotification({
          type: 'error',
          title: 'Camera unsupported',
          message: 'Your browser does not support camera scanning. Paste the QR payload manually.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (error) {
        showNotification({
          type: 'error',
          title: 'Camera unavailable',
          message: 'Grant camera permissions or paste the QR payload manually.',
        });
      }
    };

    enableCamera();

    return () => {
      const stream = streamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, [isScannerOpen, showNotification]);

  const handleManualSubmit = ({ payload }) => {
    setScanResult({ payload, timestamp: new Date().toISOString() });
    showNotification({
      type: 'success',
      title: 'Scan recorded',
      message: 'Your attendance data has been captured. Organizer will confirm shortly.',
    });
    reset();
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
    setScanResult(null);
    reset();
  };

  return (
    <section className="page" aria-labelledby="scanner-heading">
      <header className="page__header">
        <h1 id="scanner-heading">QR scanner & location check</h1>
        <p>Scan organizer-issued QR codes, validate your location, and mint badges to your connected wallet.</p>
      </header>
      <div className="page__content">
        <DashboardSection
          title="Before you scan"
          items={[
            'Allow camera access to detect event QR codes with built-in low-light optimization.',
            'Share GPS coordinates so EventChain can verify you are within the approved radius.',
            'Confirm the minting wallet and pay any entry fee or tipping gas sponsors if required.',
            'Receive instant confirmation with a tamper-proof verification hash.'
          ]}
        />
        <Button type="button" onClick={() => setIsScannerOpen(true)}>
          Launch scanner
        </Button>
      </div>
      <Modal isOpen={isScannerOpen} title="Scan event QR" onClose={closeScanner}>
        <div className="scanner-modal">
          <div className="scanner-preview">
            <video ref={videoRef} playsInline muted aria-label="Live camera preview" />
            <span className="scanner-preview__hint">Align the QR code within the frame</span>
          </div>
          <form className="event-form" onSubmit={handleSubmit(handleManualSubmit)}>
            <FormInput
              label="Or paste QR payload"
              placeholder="eventchain://attend?token=..."
              {...register('payload', { required: 'Payload is required' })}
              error={errors.payload?.message}
            />
            <footer className="event-form__actions">
              <Button type="button" variant="ghost" onClick={closeScanner} disabled={isSubmitting}>
                Close
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Confirm scan
              </Button>
            </footer>
          </form>
          {scanResult && (
            <aside className="page__section" aria-live="polite">
              <h2>Latest scan</h2>
              <p className="scanner-result__payload">{scanResult.payload}</p>
              <small>Captured {new Date(scanResult.timestamp).toLocaleTimeString()}</small>
            </aside>
          )}
        </div>
      </Modal>
    </section>
  );
};

const CollectionGallery = () => {
  const { showNotification } = useNotifications();
  const { data, isLoading, isError, refetch } = useQuery(['my-certificates'], certificateService.getMyCertificates, {
    select: (response) => response.data.data.certificates || [],
  });

  useEffect(() => {
    if (isError) {
      showNotification({
        type: 'error',
        title: 'Unable to load badges',
        message: 'Try refreshing your collection in a moment.',
      });
    }
  }, [isError, showNotification]);

  return (
    <section className="page" aria-labelledby="collection-heading">
      <header className="page__header">
        <h1 id="collection-heading">NFT collection</h1>
        <p>Browse all badges you have minted, rerun verification flows, and export shareable proof-of-attendance links.</p>
      </header>
      <div className="page__content">
        <DashboardSection
          title="Collection highlights"
          items={[
            'Filter by chain, organizer, or rarity to spotlight your proudest achievements.',
            'Access badge metadata, IPFS hashes, and verification QR codes for each NFT.',
            'Generate limited-time shareable links so friends can verify your attendance.',
            'Track progression milestones to unlock new community perks and quests.'
          ]}
        />
        <Button type="button" variant="outline" onClick={refetch} isLoading={isLoading}>
          Refresh gallery
        </Button>
        <div className="gallery-grid">
          {isLoading && <p className="muted">Loading your badges…</p>}
          {!isLoading && data?.length === 0 && <p className="muted">No badges yet. Attend an event to mint your first collectible!</p>}
          {data?.map((certificate) => (
            <article className="badge-card" key={certificate._id}>
              <header>
                <h3>{certificate.event?.title || 'Event badge'}</h3>
                <span>{certificate.network || 'Polygon'}</span>
              </header>
              <dl>
                <div>
                  <dt>Token ID</dt>
                  <dd>{certificate.tokenId || 'TBD'}</dd>
                </div>
                <div>
                  <dt>Claimed on</dt>
                  <dd>{certificate.createdAt ? new Date(certificate.createdAt).toLocaleDateString() : '—'}</dd>
                </div>
                <div>
                  <dt>Verification hash</dt>
                  <dd className="wallet-address">{certificate.verificationHash || 'Pending'}</dd>
                </div>
              </dl>
              <footer>
                <Button
                  as={Link}
                  to={`/certificates/${certificate._id}`}
                  size="sm"
                  variant="outline"
                >
                  View details
                </Button>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const SocialPulse = () => {
  const { user, refreshProfile } = useAuth();
  const { showNotification } = useNotifications();
  const defaultPreferences = useMemo(
    () => ({
      push: user?.notificationPreferences?.push ?? true,
      email: user?.notificationPreferences?.email ?? true,
      sms: user?.notificationPreferences?.sms ?? false,
    }),
    [user?.notificationPreferences]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: defaultPreferences,
  });

  useEffect(() => {
    reset(defaultPreferences);
  }, [defaultPreferences, reset]);

  const onSubmit = async (values) => {
    try {
      await authService.updateProfile({ notificationPreferences: values });
      await refreshProfile();
      showNotification({
        type: 'success',
        title: 'Preferences saved',
        message: 'We will tailor alerts to match your selections.',
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Update failed',
        message: parseAPIError(error),
      });
    }
  };

  return (
    <section className="page" aria-labelledby="social-heading">
      <header className="page__header">
        <h1 id="social-heading">Social pulse & notifications</h1>
        <p>Curate your organizer feed, follow event creators, and receive blockchain-verified updates in real time.</p>
      </header>
      <div className="page__content">
        <DashboardSection
          title="Engagement tools"
          items={[
            'Follow organizers to highlight their new drops on your personalized activity feed.',
            'Enable push or email notifications for new events, QR activation windows, and badge drops.',
            'Discover recommended events based on mutual follows and attendance history.',
            'Review security notices to avoid QR phishing or spoofed event links.'
          ]}
        />
        <form className="page__section" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="toggle-group">
            <legend>Notification channels</legend>
            <label className="toggle-field">
              <input type="checkbox" {...register('push')} />
              <span>
                <strong>Push notifications</strong>
                <small>In-app alerts for live QR windows, reminders, and event updates.</small>
              </span>
            </label>
            <label className="toggle-field">
              <input type="checkbox" {...register('email')} />
              <span>
                <strong>Email digests</strong>
                <small>Weekly summaries plus critical alerts for RSVP confirmations.</small>
              </span>
            </label>
            <label className="toggle-field">
              <input type="checkbox" {...register('sms')} />
              <span>
                <strong>SMS buzz</strong>
                <small>On-site reminders and QR unlock codes (carrier rates may apply).</small>
              </span>
            </label>
          </fieldset>
          <footer className="event-form__actions">
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Save preferences
            </Button>
          </footer>
        </form>
      </div>
    </section>
  );
};

const FeatureCard = ({ title, description, ctaLabel, to }) => (
  <article className="feature-card">
    <h2>{title}</h2>
    <p>{description}</p>
    <Button as={Link} to={`/dashboard/attendee/${to}`} size="sm">
      {ctaLabel}
    </Button>
  </article>
);

const DashboardSection = ({ title, items }) => (
  <section className="dashboard-section">
    <h2>{title}</h2>
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </section>
);

export default AttendeeDashboard;
