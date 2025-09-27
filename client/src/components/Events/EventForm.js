import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import Button from '../UI/Button';
import FormInput from '../UI/FormInput';
import './EventForm.css';

const DEFAULT_VALUES = {
  title: '',
  shortDescription: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  location: {
    address: '',
    venue: '',
    city: '',
    country: '',
    coordinates: {
      lat: '',
      lng: '',
    },
  },
  maxCapacity: 100,
  registrationDeadline: '',
  registrationFee: 0,
  category: 'other',
  tags: '',
  credits: 1,
  attendanceRadius: 100,
  isPublic: true,
  requiresApproval: false,
  allowWaitlist: false,
  status: 'draft',
};

const mapInitialValues = (initialValues) => {
  if (!initialValues) return DEFAULT_VALUES;
  return {
    ...DEFAULT_VALUES,
    ...initialValues,
    date: initialValues?.date ? initialValues.date.substring(0, 10) : DEFAULT_VALUES.date,
    registrationDeadline: initialValues?.registrationDeadline
      ? initialValues.registrationDeadline.substring(0, 10)
      : DEFAULT_VALUES.registrationDeadline,
    tags: Array.isArray(initialValues?.tags) ? initialValues.tags.join(', ') : initialValues?.tags ?? DEFAULT_VALUES.tags,
    location: {
      ...DEFAULT_VALUES.location,
      ...initialValues?.location,
      coordinates: {
        ...DEFAULT_VALUES.location.coordinates,
        ...initialValues?.location?.coordinates,
      },
    },
  };
};

const EventForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = 'Create event',
  secondaryAction,
}) => {
  const formDefaults = useMemo(() => mapInitialValues(initialValues), [initialValues]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: formDefaults,
  });

  useEffect(() => {
    reset(formDefaults);
  }, [formDefaults, reset]);

  const handleFormSubmit = (values) => {
    const tagsArray = values.tags
      ? values.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    const payload = {
      ...values,
      tags: tagsArray,
      date: values.date ? new Date(values.date).toISOString() : null,
      registrationDeadline: values.registrationDeadline ? new Date(values.registrationDeadline).toISOString() : null,
      maxCapacity: values.maxCapacity ? Number(values.maxCapacity) : null,
      registrationFee: values.registrationFee ? Number(values.registrationFee) : 0,
      credits: values.credits ? Number(values.credits) : 1,
      attendanceRadius: values.attendanceRadius ? Number(values.attendanceRadius) : 100,
      location: {
        ...values.location,
        coordinates: {
          lat: typeof values.location.coordinates.lat === 'number'
            ? values.location.coordinates.lat
            : Number(values.location.coordinates.lat),
          lng: typeof values.location.coordinates.lng === 'number'
            ? values.location.coordinates.lng
            : Number(values.location.coordinates.lng),
        },
      },
    };

    onSubmit(payload);
  };

  return (
    <form className="event-form" onSubmit={handleSubmit(handleFormSubmit)}>
      <section className="event-form__section">
        <h3>Event basics</h3>
        <div className="form-grid">
          <FormInput
            label="Title"
            placeholder="Blockchain Builder Summit"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
          />
          <FormInput
            label="Short description"
            placeholder="Displayed in listings"
            {...register('shortDescription', {
              maxLength: { value: 200, message: 'Short description cannot exceed 200 characters' },
            })}
            error={errors.shortDescription?.message}
          />
          <div className="form-field">
            <span className="form-field__label">Full description</span>
            <textarea
              className={clsx('form-field__input', errors.description && 'has-error')}
              rows={4}
              placeholder="Tell attendees what makes this event unmissable."
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 20, message: 'Description should be at least 20 characters' },
                maxLength: { value: 2000, message: 'Description cannot exceed 2000 characters' },
              })}
            />
            {errors.description && <small className="form-field__helper has-error">{errors.description.message}</small>}
          </div>
        </div>
      </section>

      <section className="event-form__section">
        <h3>Schedule</h3>
        <div className="form-grid">
          <FormInput
            label="Date"
            type="date"
            {...register('date', { required: 'Date is required' })}
            error={errors.date?.message}
          />
          <FormInput
            label="Start time"
            type="time"
            {...register('startTime', {
              required: 'Start time is required',
              pattern: { value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, message: 'Use HH:MM format' },
            })}
            error={errors.startTime?.message}
          />
          <FormInput
            label="End time"
            type="time"
            {...register('endTime', {
              required: 'End time is required',
              pattern: { value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, message: 'Use HH:MM format' },
            })}
            error={errors.endTime?.message}
          />
          <FormInput
            label="Registration deadline"
            type="date"
            {...register('registrationDeadline')}
            error={errors.registrationDeadline?.message}
            helperText="Must be before the event date"
          />
        </div>
      </section>

      <section className="event-form__section">
        <h3>Location & capacity</h3>
        <div className="form-grid">
          <FormInput
            label="Venue"
            placeholder="EventChain HQ"
            {...register('location.venue', { required: 'Venue is required' })}
            error={errors.location?.venue?.message}
          />
          <FormInput
            label="Address"
            placeholder="123 Proof Street"
            {...register('location.address', { required: 'Address is required' })}
            error={errors.location?.address?.message}
          />
          <FormInput
            label="City"
            placeholder="Lisbon"
            {...register('location.city')}
          />
          <FormInput
            label="Country"
            placeholder="Portugal"
            {...register('location.country')}
          />
          <FormInput
            label="Latitude"
            type="number"
            step="any"
            {...register('location.coordinates.lat', {
              required: 'Latitude is required',
              valueAsNumber: true,
              min: { value: -90, message: 'Latitude must be at least -90' },
              max: { value: 90, message: 'Latitude cannot exceed 90' },
            })}
            error={errors.location?.coordinates?.lat?.message}
          />
          <FormInput
            label="Longitude"
            type="number"
            step="any"
            {...register('location.coordinates.lng', {
              required: 'Longitude is required',
              valueAsNumber: true,
              min: { value: -180, message: 'Longitude must be at least -180' },
              max: { value: 180, message: 'Longitude cannot exceed 180' },
            })}
            error={errors.location?.coordinates?.lng?.message}
          />
          <FormInput
            label="Max capacity"
            type="number"
            min={1}
            {...register('maxCapacity', { valueAsNumber: true, min: { value: 1, message: 'Minimum capacity is 1' } })}
            error={errors.maxCapacity?.message}
          />
          <FormInput
            label="Attendance radius (m)"
            type="number"
            min={10}
            max={1000}
            {...register('attendanceRadius', {
              valueAsNumber: true,
              min: { value: 10, message: 'Minimum radius is 10m' },
              max: { value: 1000, message: 'Maximum radius is 1000m' },
            })}
            error={errors.attendanceRadius?.message}
          />
        </div>
      </section>

      <section className="event-form__section">
        <h3>Rewards & monetisation</h3>
        <div className="form-grid">
          <FormInput
            label="Entry fee (ETH)"
            type="number"
            step="0.0001"
            min={0}
            {...register('registrationFee', { valueAsNumber: true, min: { value: 0, message: 'Fee cannot be negative' } })}
            error={errors.registrationFee?.message}
          />
          <FormInput
            label="Credits awarded"
            type="number"
            min={1}
            {...register('credits', { valueAsNumber: true, min: { value: 1, message: 'Credits must be >= 1' } })}
            error={errors.credits?.message}
          />
          <FormInput
            label="Category"
            placeholder="workshop"
            {...register('category')}
          />
          <FormInput
            label="Tags"
            placeholder="web3, hackathon"
            helperText="Comma separated tags"
            {...register('tags')}
          />
        </div>
      </section>

      <section className="event-form__section">
        <h3>Controls</h3>
        <div className="event-form__toggles">
          <ToggleField
            label="Public event"
            description="Listed on public discovery and searchable by all attendees."
            registration={register('isPublic')}
          />
          <ToggleField
            label="Requires approval"
            description="Manual confirmation before attendees secure their spot."
            registration={register('requiresApproval')}
          />
          <ToggleField
            label="Allow waitlist"
            description="Automatically capture interest once capacity is reached."
            registration={register('allowWaitlist')}
          />
          <div className="form-field">
            <span className="form-field__label">Status</span>
            <select className="form-field__input" {...register('status')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </section>

      <footer className="event-form__actions">
        {secondaryAction && (
          <Button type="button" variant="ghost" onClick={secondaryAction.onClick} disabled={isSubmitting}>
            {secondaryAction.label}
          </Button>
        )}
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </footer>
    </form>
  );
};

const ToggleField = ({ label, description, registration }) => (
  <label className="toggle-field">
    <input type="checkbox" {...registration} />
    <span>
      <strong>{label}</strong>
      <small>{description}</small>
    </span>
  </label>
);

export default EventForm;
