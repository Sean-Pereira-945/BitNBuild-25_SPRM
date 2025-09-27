import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../components/UI/Button';
import FormInput from '../components/UI/FormInput';
import useAuth from '../hooks/useAuth';
import * as authService from '../services/authService';
import { useNotifications } from '../context/NotificationContext';
import { parseAPIError } from '../utils/errorHandling';
import './pages.css';

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const { showNotification } = useNotifications();
  const [isSaving, setIsSaving] = useState(false);

  const defaultValues = useMemo(
    () => ({
      name: user?.name || '',
      bio: user?.bio || '',
      walletAddress: user?.walletAddress || '',
      profileVisibility: user?.profileVisibility || 'public',
      notificationPreferences: {
        email: user?.notificationPreferences?.email ?? true,
        push: user?.notificationPreferences?.push ?? true,
        eventReminders: user?.notificationPreferences?.eventReminders ?? true,
        organizerAnnouncements: user?.notificationPreferences?.organizerAnnouncements ?? true,
        nftUpdates: user?.notificationPreferences?.nftUpdates ?? true
      }
    }),
    [user]
  );

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = async (values) => {
    try {
      setIsSaving(true);
      await authService.updateProfile({
        name: values.name,
        bio: values.bio,
        walletAddress: values.walletAddress?.trim() || null,
        profileVisibility: values.profileVisibility,
        notificationPreferences: values.notificationPreferences
      });
      await refreshProfile();
      showNotification({
        type: 'success',
        title: 'Profile updated',
        message: 'Your preferences were saved successfully.'
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Update failed',
        message: parseAPIError(error)
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="page" aria-labelledby="profile-heading">
      <header className="page__header">
        <h1 id="profile-heading">Profile & preferences</h1>
        <p>Control what the community sees, connect your wallet, and fine-tune how you receive updates.</p>
      </header>
      <form className="page__content" onSubmit={handleSubmit(onSubmit)}>
        <div className="page__section" aria-labelledby="profile-basic-heading">
          <div className="page__section-header">
            <h2 id="profile-basic-heading">Account details</h2>
            <p>Keep your identity current so organizers and attendees know who they are interacting with.</p>
          </div>
          <div className="form-grid">
            <FormInput
              label="Full name"
              placeholder="Ada Lovelace"
              autoComplete="name"
              {...register('name', { required: 'Name is required' })}
              error={formState.errors.name?.message}
            />
            <div className="form-field">
              <span className="form-field__label">Bio</span>
              <textarea
                className="form-field__input form-field__textarea"
                rows={4}
                placeholder="Share your mission, achievements, or community goals."
                {...register('bio', { maxLength: { value: 500, message: 'Bio cannot exceed 500 characters' } })}
              />
              {formState.errors.bio && <small className="form-field__helper has-error">{formState.errors.bio.message}</small>}
            </div>
            <FormInput
              label="Wallet address"
              placeholder="0x..."
              helperText="Used for NFT minting and badge claims."
              {...register('walletAddress', {
                pattern: {
                  value: /^0x[a-fA-F0-9]{40}$/,
                  message: 'Enter a valid Ethereum-compatible wallet address'
                }
              })}
              error={formState.errors.walletAddress?.message}
            />
            <div className="form-field">
              <span className="form-field__label">Profile visibility</span>
              <select className="form-field__input" {...register('profileVisibility')}> 
                <option value="public">Public - anyone can view your profile</option>
                <option value="private">Private - only followers and admins can view</option>
              </select>
            </div>
          </div>
        </div>

        <div className="page__section" aria-labelledby="notification-preferences-heading">
          <div className="page__section-header">
            <h2 id="notification-preferences-heading">Notifications</h2>
            <p>Choose how EventChain keeps you informed about drops, attendance, and social activity.</p>
          </div>
          <div className="checkbox-grid">
            <CheckboxField
              label="Email alerts"
              description="Receive event reminders, confirmations, and follow updates in your inbox."
              registration={register('notificationPreferences.email')}
            />
            <CheckboxField
              label="Push notifications"
              description="Get real-time alerts in the web app or mobile companion."
              registration={register('notificationPreferences.push')}
            />
            <CheckboxField
              label="Event reminders"
              description="Heads-up messages when a session, drop, or QR window is about to open."
              registration={register('notificationPreferences.eventReminders')}
            />
            <CheckboxField
              label="Organizer announcements"
              description="News from organizers you follow, including new events and behind-the-scenes drops."
              registration={register('notificationPreferences.organizerAnnouncements')}
            />
            <CheckboxField
              label="NFT updates"
              description="Alerts when badges are minted, verified, or shared from your collection."
              registration={register('notificationPreferences.nftUpdates')}
            />
          </div>
        </div>

        <footer className="page__actions">
          <Button type="button" variant="ghost" onClick={() => reset(defaultValues)} disabled={isSaving}>
            Reset changes
          </Button>
          <Button type="submit" isLoading={isSaving}>
            Save profile
          </Button>
        </footer>
      </form>
    </section>
  );
};

const CheckboxField = ({ label, description, registration }) => (
  <label className="checkbox-card">
    <input type="checkbox" {...registration} />
    <span>
      <strong>{label}</strong>
      <small>{description}</small>
    </span>
  </label>
);

export default ProfilePage;
