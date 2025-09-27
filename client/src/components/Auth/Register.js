import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../UI/Button';
import FormInput from '../UI/FormInput';
import useAuth from '../../hooks/useAuth';
import { ROLE_OPTIONS } from '../../utils/constants';
import styles from './Auth.module.css';

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'attendee',
      walletAddress: ''
    }
  });
  const { register: registerUser, loading } = useAuth();

  const onSubmit = async (values) => {
    const { password, confirmPassword, walletAddress, ...rest } = values;
    if (password !== confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    try {
      await registerUser({
        ...rest,
        password,
        walletAddress: walletAddress?.trim() || undefined,
        profileVisibility: 'public'
      });
      navigate('/login', { replace: true, state: { email: rest.email } });
    } catch (error) {
      setError('root', { message: error?.response?.data?.message || 'Unable to register. Please try again.' });
    }
  };

  return (
    <section className={styles.authContainer} aria-labelledby="register-heading">
      <header>
        <h1 id="register-heading" className={styles.title}>
          Create your account
        </h1>
        <p className={styles.subtitle}>Register to unlock blockchain-verified event experiences.</p>
      </header>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormInput
          label="Full name"
          placeholder="Ada Lovelace"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />
        <FormInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address'
            }
          })}
        />
        <FormInput
          label="Password"
          type="password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            }
          })}
        />
        <FormInput
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === watch('password') || 'Passwords do not match'
          })}
        />
        {errors.root && (
          <p role="alert" className={styles.error}>
            {errors.root.message}
          </p>
        )}
        <fieldset className={styles.fieldset}>
          <legend>Choose your role</legend>
          <p className={styles.helper}>Select how you plan to use EventChain today. You can request changes later.</p>
          <div className={styles.radioGroup}>
            {ROLE_OPTIONS.map((option) => (
              <label key={option.value} className={styles.radioCard}>
                <input
                  type="radio"
                  value={option.value}
                  {...register('role', { required: 'Please select a role' })}
                />
                <span className={styles.radioContent}>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
              </label>
            ))}
          </div>
          {errors.role && (
            <p role="alert" className={styles.error}>
              {errors.role.message}
            </p>
          )}
        </fieldset>
        <FormInput
          label="Wallet address"
          placeholder="0x..."
          autoComplete="off"
          error={errors.walletAddress?.message}
          {...register('walletAddress', {
            pattern: {
              value: /^0x[a-fA-F0-9]{40}$/,
              message: 'Enter a valid Ethereum-compatible wallet address'
            }
          })}
          helperText="Optional for now. Required when minting or claiming NFTs."
        />
        <Button type="submit" isLoading={loading}>
          Create account
        </Button>
      </form>
      <p className={styles.switcher}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </section>
  );
};

export default Register;
