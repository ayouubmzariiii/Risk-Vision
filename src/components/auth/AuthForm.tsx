import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import Button from '../ui/Button';
import { LogIn, UserPlus, Mail } from 'lucide-react';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess }) => {
  const { signIn, signUp, signInWithGoogle, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('user');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (mode === 'signin' && (!email || !password)) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (mode === 'signup' && (!email || !password || !displayName || !jobTitle || !department || !company)) {
      setFormError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp({
          email,
          password,
          displayName,
          jobTitle,
          department,
          company,
          role,
          phoneNumber
        });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        isLoading={loading}
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        {mode === 'signup' && (
          <>
            <Input
              label="Full Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your full name"
              required
            />

            <Input
              label="Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter your job title"
              required
            />

            <Input
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Enter your department"
              required
            />

            <Input
              label="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter your company name"
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number (optional)"
            />
          </>
        )}

        {(error || formError) && (
          <p className="text-sm text-red-600">
            {error || formError}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          icon={mode === 'signin' ? <LogIn size={16} /> : <UserPlus size={16} />}
          isLoading={loading}
        >
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;