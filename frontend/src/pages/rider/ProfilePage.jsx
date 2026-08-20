import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../api/userApi';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { showToast } from '../../store/uiSlice';
import { useDispatch } from 'react-redux';
import { User, Mail, Phone, Shield, Save, CheckCircle2 } from 'lucide-react';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userApi.updateProfile({
        firstName,
        lastName,
        phone,
        profileImage,
      });
      if (res.success) {
        dispatch(showToast({ type: 'success', message: 'Profile updated successfully!' }));
      }
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err.message }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">My Profile</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your account preferences and personal details.
        </p>
      </div>

      <Card className="p-6 sm:p-8 bg-zinc-950 border border-zinc-800 shadow-2xl space-y-6">
        {/* Header Avatar Display */}
        <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700 overflow-hidden flex items-center justify-center text-white font-black text-xl">
            {profileImage ? (
              <img src={profileImage} alt={firstName} className="w-full h-full object-cover" />
            ) : (
              firstName.charAt(0) || 'U'
            )}
          </div>
          <div>
            <h3 className="text-lg font-black text-white">{user?.fullName || `${firstName} ${lastName}`}</h3>
            <p className="text-xs text-zinc-400">{user?.email}</p>
            <div className="mt-2">
              <Badge status={user?.role} size="xs" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              required
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
              required
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            value={user?.email || ''}
            disabled
            helperText="Email address cannot be changed."
          />

          <Input
            label="Mobile Number (India)"
            type="tel"
            icon={Phone}
            value={phone}
            placeholder="+91 98765 43210"
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label="Profile Image URL"
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
            helperText="Direct link to avatar image."
          />

          <div className="pt-3">
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={saving}
              icon={Save}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
