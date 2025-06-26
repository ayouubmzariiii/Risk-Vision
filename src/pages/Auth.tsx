import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';
import { Card, CardContent } from '../components/ui/Card';
import { Shield } from 'lucide-react';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 relative">
      {/* Sponsor Logo - Top Right */}
      <div className="absolute top-6 right-6">
        <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm px-3 py-2">
          <span className="text-gray-500 text-sm">Sponsored by</span>
          <img 
            src="/black_logo.png" 
            alt="Sponsor Logo" 
            className="h-6 w-auto opacity-80"
          />
        </div>
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Shield className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <AuthForm
              mode={mode}
              onSuccess={() => navigate('/')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;