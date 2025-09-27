import { useCallback, useMemo, useState } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { formatDistanceStrict } from 'date-fns';
import Button from '../components/UI/Button';
import FormInput from '../components/UI/FormInput';
import Modal from '../components/UI/Modal';
import useAuth from '../hooks/useAuth';
import { useNotifications } from '../context/NotificationContext';
import { parseAPIError } from '../utils/errorHandling';
import './pages.css';

const OrganizerDashboard = () => (
  <Routes>
    <Route index element={<OrganizerOverview />} />
    <Route path="events" element={<EventWorkshop />} />
    <Route path="nft-badges" element={<NftStudio />} />
    <Route path="qr-codes" element={<QrOrchestrator />} />
    <Route path="finance" element={<GasConsole />} />
    <Route path="*" element={<Navigate to="." replace />} />
  </Routes>
);

const OrganizerOverview = () => {
  const { user } = useAuth();
  return (
    <section className="page" aria-labelledby="organizer-overview-heading">
      <header className="page__header">
        <h1 id="organizer-overview-heading">Welcome back, {user?.name?.split(' ')[0] || 'organizer'}!</h1>
        <p>Launch unforgettable experiences, mint POAP NFTs, and engage your community in one streamlined space.</p>
      </header>
      <div className="page__content page__grid">
        <FeatureCard
          title="Create an event"
          description="Spin up a new on-chain event complete with GPS validation, waitlists, and NFT badge automation."
          ctaLabel="Start event wizard"
          to="events"
        />
        <FeatureCard
          title="Mint NFT badges"
          description="Upload custom artwork, define metadata, and deploy a dedicated ERC-721 collection per event."
          ctaLabel="Open NFT studio"
          to="nft-badges"
        />
        <FeatureCard
          title="Control QR check-ins"
          description="Generate location-aware QR codes, activate claim windows, and monitor real-time attendance."
          ctaLabel="Manage QR codes"
          to="qr-codes"
        />
        <FeatureCard
          title="Estimate gas fees"
          description="Connect your wallet, review live gas estimates, and confirm minting costs before deploying."
          ctaLabel="Open gas console"
          to="finance"
        />
      </div>
    </section>
  );
};

const EventWorkshop = () => {
  const navigate = useNavigate();
  return (
    <section className="page" aria-labelledby="event-builder-heading">
      <header className="page__header">
        <h1 id="event-builder-heading">Event creation & management</h1>
        <p>Draft public or private gatherings, invite attendees, and sync logistics with blockchain-backed proof of attendance.</p>
      </header>
      <div className="page__content">
        <DashboardSection
          title="Event essentials"
          items={[
            'Capture titles, rich descriptions, and event imagery that define the experience.',
            'Configure GPS coordinates and attendance radius to unlock geo-fenced check-ins.',
            'Set capacity, waitlists, and enrollment deadlines to handle sell-out crowds.',
            'Attach invitee lists for private drops or approve on-chain RSVPs in batches.'
          ]}
        />
        <DashboardSection
          title="Organizer workflow tips"
          items={[
            'Use templates for recurring meetups to clone formats in seconds.',
            'Schedule automated reminders to keep attendees and staff aligned.',
            'Sync with Google Calendar or iCal feeds to broadcast updates instantly.'
          ]}
        />
        <Button type="button" variant="primary" onClick={() => navigate('/events?create=1')}>
          Launch event wizard
        </Button>
      </div>
    </section>
  );
};

const NftStudio = () => {
  const { showNotification } = useNotifications();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [previewMetadata, setPreviewMetadata] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      maxSupply: 100,
      network: 'polygon',
    },
  });

  const imageUrl = watch('imageUrl');

  const handleCompose = (values) => {
    setPreviewMetadata({ ...values, timestamp: new Date().toISOString() });
    showNotification({
      type: 'success',
      title: 'Metadata prepared',
      message: 'Your NFT badge metadata is ready. Upload to IPFS when you are set.',
    });
    reset();
    setIsComposerOpen(false);
  };

  return (
    <section className="page" aria-labelledby="nft-studio-heading">
      <header className="page__header">
        <h1 id="nft-studio-heading">NFT badge studio</h1>
        <p>Design and deploy proof-of-attendance NFTs that attendees can proudly showcase across Web3.</p>
      </header>
      <div className="page__content">
        <DashboardSection
          title="Badge pipeline"
          items={[
            'Upload custom images or select from template galleries optimized for POAP badges.',
            'Generate IPFS metadata with event details, GPS proofs, and organizer signatures.',
            'Deploy an ERC-721 contract per event or reuse a collection with metadata overrides.',
            'Configure minting rules including claim windows, attendee whitelists, and batch minting.'
          ]}
        />
        <DashboardSection
          title="Quality checklist"
          items={[
            'Preview badge art across mobile and desktop to guarantee readability.',
            'Set verification hashes to enable public inspection and anti-forgery checks.',
            'Schedule staged minting to avoid peak gas spikes and ensure availability.'
          ]}
        />
        <Button type="button" variant="outline" onClick={() => setIsComposerOpen(true)}>
          Design new badge
        </Button>
        {previewMetadata && (
          <div className="page__section">
            <h2>Latest metadata preview</h2>
            <pre className="metadata-preview" aria-live="polite">
{JSON.stringify(previewMetadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
      <Modal isOpen={isComposerOpen} title="Compose NFT badge" onClose={() => setIsComposerOpen(false)}>
        <form className="event-form" onSubmit={handleSubmit(handleCompose)}>
          <FormInput
            label="Badge name"
            placeholder="VIP Summit Pass"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          <div className="form-field">
            <span className="form-field__label">Description</span>
            <textarea
              className="form-field__input"
              rows={4}
              placeholder="Describe when and how this badge is earned."
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <small className="form-field__helper has-error">{errors.description.message}</small>}
          </div>
          <FormInput
            label="Artwork URL"
            placeholder="https://ipfs.io/ipfs/..."
            {...register('imageUrl', {
              required: 'An image URL is required',
              pattern: { value: /^https?:\/\/.+/, message: 'Provide a valid URL' },
            })}
            error={errors.imageUrl?.message}
          />
          {imageUrl && (
            <img src={imageUrl} alt="Badge preview" className="badge-preview" />
          )}
          <FormInput
            label="Max supply"
            type="number"
            min={1}
            {...register('maxSupply', { valueAsNumber: true, min: { value: 1, message: 'Minimum supply is 1' } })}
            error={errors.maxSupply?.message}
          />
          <div className="form-field">
            <span className="form-field__label">Network</span>
            <select className="form-field__input" {...register('network')}>
              <option value="polygon">Polygon</option>
              <option value="ethereum">Ethereum</option>
              <option value="optimism">Optimism</option>
            </select>
          </div>
          <footer className="event-form__actions">
            <Button type="button" variant="ghost" onClick={() => setIsComposerOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Generate metadata
            </Button>
          </footer>
        </form>
      </Modal>
    </section>
  );
};

const generateQrId = () => {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `qr_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
};

const QrOrchestrator = () => {
  const { showNotification } = useNotifications();
  const [windows, setWindows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      label: '',
      radius: 100,
      active: true,
    },
  });

  const handleCreateWindow = (values) => {
    const payload = {
      id: generateQrId(),
      ...values,
      radius: Number(values.radius),
      createdAt: new Date().toISOString(),
    };
    setWindows((prev) => [payload, ...prev]);
    setIsModalOpen(false);
    reset();
    showNotification({
      type: 'success',
      title: 'QR window ready',
      message: 'Distribute the generated QR codes to begin check-ins.',
    });
  };

  const toggleWindow = (id) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id
          ? { ...window, active: !window.active }
          : window
      )
    );
  };

  return (
    <section className="page" aria-labelledby="qr-manager-heading">
      <header className="page__header">
        <h1 id="qr-manager-heading">QR code orchestration</h1>
        <p>Issue dynamic QR codes, enforce check-in policies, and keep the minting line moving smoothly.</p>
      </header>
      <div className="page__content">
        <DashboardSection
          title="Control center"
          items={[
            'Generate per-attendee QR codes bound to wallet addresses and event IDs.',
            'Enable or pause claim windows with a single click when capacity hits limits.',
            'Tie QR unlocks to on-site GPS validation for fraud-resistant attendance.',
            'Monitor live scan events and trigger notifications for suspected duplicates.'
          ]}
        />
        <DashboardSection
          title="Security best practices"
          items={[
            'Rotate QR seeds between event phases to deter screenshots and replays.',
            'Require staff confirmation before re-issuing replacement QR codes.',
            'Pipe QR activity into the analytics dashboard to study attendee flow.'
          ]}
        />
        <Button type="button" onClick={() => setIsModalOpen(true)}>
          Open QR command center
        </Button>
        {windows.length > 0 && (
          <div className="page__section">
            <h2>Active QR windows</h2>
            <ul className="event-details__list">
              {windows.map((window) => (
                <li key={window.id}>
                  <span>
                    {window.label || 'Unnamed window'}
                    <br />
                    <small>{window.radius}m radius · Created {formatDistanceStrict(new Date(window.createdAt), new Date(), { addSuffix: true })}</small>
                  </span>
                  <Button size="xs" variant="outline" onClick={() => toggleWindow(window.id)}>
                    {window.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Modal isOpen={isModalOpen} title="Create QR window" onClose={() => setIsModalOpen(false)}>
        <form className="event-form" onSubmit={handleSubmit(handleCreateWindow)}>
          <FormInput
            label="Label"
            placeholder="Main entrance"
            {...register('label', { required: 'Label is required' })}
            error={errors.label?.message}
          />
          <FormInput
            label="Attendance radius"
            type="number"
            min={10}
            max={500}
            {...register('radius', {
              valueAsNumber: true,
              min: { value: 10, message: 'Minimum radius is 10m' },
              max: { value: 500, message: 'Maximum radius is 500m' },
            })}
            error={errors.radius?.message}
          />
          <label className="toggle-field">
            <input type="checkbox" {...register('active')} />
            <span>
              <strong>Activate immediately</strong>
              <small>Enable scans right away once this window is created.</small>
            </span>
          </label>
          <footer className="event-form__actions">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save window
            </Button>
          </footer>
        </form>
      </Modal>
    </section>
  );
};

const GasConsole = () => {
  const { showNotification } = useNotifications();
  const [walletInfo, setWalletInfo] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      showNotification({
        type: 'error',
        title: 'Wallet not detected',
        message: 'Install MetaMask or another Web3 wallet extension to continue.',
      });
      return;
    }

    try {
      setIsConnecting(true);
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const gasPrice = await window.ethereum.request({ method: 'eth_gasPrice' });

      setWalletInfo({
        account,
        chainId,
        gasPrice,
      });
      showNotification({
        type: 'success',
        title: 'Wallet connected',
        message: 'You can now estimate gas fees and launch NFT badge minting flows.',
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Wallet connection failed',
        message: parseAPIError(error),
      });
    } finally {
      setIsConnecting(false);
    }
  }, [showNotification]);

  const gasInGwei = useMemo(() => {
    if (!walletInfo?.gasPrice) return null;
    return parseInt(walletInfo.gasPrice, 16) / 1e9;
  }, [walletInfo]);

  return (
    <section className="page" aria-labelledby="gas-console-heading">
      <header className="page__header">
        <h1 id="gas-console-heading">Wallet & gas console</h1>
        <p>Connect your Web3 wallet, estimate minting costs, and settle transactions with confidence.</p>
      </header>
      <div className="page__content">
        <DashboardSection
          title="What you can do next"
          items={[
            'Link a MetaMask or WalletConnect session to authorize minting transactions.',
            'Preview gas spend across Polygon, Ethereum, and future supported chains.',
            'Set minting budgets, enable spending alerts, and export invoices for accounting.',
            'Explore gasless attendee claiming via meta-transactions the platform can sponsor.'
          ]}
        />
        <Button type="button" variant="primary" onClick={connectWallet} isLoading={isConnecting}>
          Connect organizer wallet
        </Button>
        {walletInfo && (
          <div className="page__section">
            <h2>Connection details</h2>
            <dl className="event-details__section">
              <div>
                <dt>Account</dt>
                <dd className="wallet-address">{walletInfo.account}</dd>
              </div>
              <div>
                <dt>Chain ID</dt>
                <dd>{walletInfo.chainId}</dd>
              </div>
              <div>
                <dt>Gas price</dt>
                <dd>{gasInGwei ? `${gasInGwei.toFixed(2)} Gwei` : 'Fetching…'}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </section>
  );
};

const FeatureCard = ({ title, description, ctaLabel, to }) => (
  <article className="feature-card">
    <h2>{title}</h2>
    <p>{description}</p>
    <Button as={Link} to={`/dashboard/organizer/${to}`} size="sm">
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

export default OrganizerDashboard;
