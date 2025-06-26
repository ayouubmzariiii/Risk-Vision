import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Save, User, Lock, AlertTriangle, Shield, Key } from 'lucide-react';
import Modal from '../components/ui/Modal';
import AppLayout from '../components/layout/AppLayout';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Profile: React.FC = () => {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    displayName: '',
    jobTitle: '',
    department: '',
    company: '',
    phoneNumber: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    password: '',
    confirmation: '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData({
            displayName: userData.displayName || '',
            jobTitle: userData.jobTitle || '',
            department: userData.department || '',
            company: userData.company || '',
            phoneNumber: userData.phoneNumber || '',
          });
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load user data');
      }
    };

    loadUserData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateProfile(formData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setShowPasswordModal(false);
      setSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmation.confirmation !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteAccount(deleteConfirmation.password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || ''}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <User size={32} className="text-blue-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="Enter your full name"
              />

              <Input
                label="Job Title"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="Enter your job title"
              />

              <Input
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Enter your department"
              />

              <Input
                label="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Enter your company name"
              />

              <Input
                label="Phone Number"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="Enter your phone number"
              />

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              {success && (
                <p className="text-sm text-green-600">Profile updated successfully!</p>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  icon={<Save size={16} />}
                  isLoading={loading}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Password</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Ensure your account is using a strong password for security.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
                    <p className="text-sm text-gray-500">
                      Update your password to keep your account secure.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    icon={<Lock size={16} />}
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">Account</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Manage your account settings and delete your account.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Delete Account</h3>
                    <p className="text-sm text-gray-500">
                      Permanently delete your account and all associated data.
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    icon={<AlertTriangle size={16} />}
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Password"
        >
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />

            <Input
              type="password"
              label="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
            />

            <Input
              type="password"
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon={<Lock size={16} />}
                isLoading={loading}
              >
                Change Password
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Account"
        >
          <form onSubmit={handleDeleteAccount} className="space-y-4">
            <div className="p-4 bg-red-50 text-red-800 rounded-lg">
              <p className="font-medium">Warning: This action cannot be undone</p>
              <p className="text-sm mt-1">
                All your data will be permanently deleted. Please type DELETE to confirm.
              </p>
            </div>

            <Input
              type="password"
              label="Enter your password"
              value={deleteConfirmation.password}
              onChange={(e) => setDeleteConfirmation({ ...deleteConfirmation, password: e.target.value })}
              required
            />

            <Input
              label="Type DELETE to confirm"
              value={deleteConfirmation.confirmation}
              onChange={(e) => setDeleteConfirmation({ ...deleteConfirmation, confirmation: e.target.value })}
              required
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                icon={<AlertTriangle size={16} />}
                isLoading={loading}
              >
                Delete Account
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default Profile;