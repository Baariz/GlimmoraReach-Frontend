import { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { CURRENCIES } from '../utils/helpers';
import ConnectPlatformModal from '../components/ConnectPlatformModal';
import { fetchTeam, inviteTeamMember, removeTeamMember } from '../utils/api';

const PLATFORMS = [
  {
    key: 'google',
    name: 'Google Ads',
    letter: 'G',
    color: '#4285F4',
  },
  {
    key: 'meta',
    name: 'Meta Ads',
    letter: 'M',
    color: '#1877F2',
  },
  {
    key: 'linkedin',
    name: 'LinkedIn Ads',
    letter: 'in',
    color: '#0A66C2',
  },
  {
    key: 'glimmora',
    name: 'Glimmora Reach',
    letter: 'GR',
    color: '#6b4d3d',
  },
];

const TEAM_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'campaign_manager', label: 'Campaign Manager' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'viewer', label: 'Viewer' },
];

export default function Profile() {
  const { user, currency, setCurrency, SUPPORTED_CURRENCIES, connectedPlatforms, connectPlatform, disconnectPlatform } = useAuth();
  const addToast = useToast();

  // Local fallback state for connected platforms if AuthContext doesn't provide them
  const [localConnected, setLocalConnected] = useState({ google: false, meta: false, linkedin: false });
  const platforms = connectedPlatforms || localConnected;

  const [modalPlatform, setModalPlatform] = useState(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  // Team management state
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'viewer' });
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  // Fetch team members on mount
  useEffect(() => {
    loadTeam();
  }, []);

  async function loadTeam() {
    setTeamLoading(true);
    try {
      const res = await fetchTeam();
      setTeamMembers(res.data?.data || []);
    } catch {
      // silently handle - demo mode may not have endpoint
      setTeamMembers([]);
    } finally {
      setTeamLoading(false);
    }
  }

  function isPlatformConnected(key) {
    // Glimmora Reach is the internal ad engine - always connected
    if (key === 'glimmora') return true;
    return platforms[key] === true;
  }

  function handleConnect(platformKey) {
    setModalPlatform(platformKey);
  }

  function handlePlatformConnected() {
    if (modalPlatform) {
      if (connectPlatform) {
        connectPlatform(modalPlatform);
      } else {
        setLocalConnected((prev) => ({ ...prev, [modalPlatform]: true }));
      }
      addToast(`${PLATFORMS.find((p) => p.key === modalPlatform)?.name} connected successfully!`);
    }
    setModalPlatform(null);
  }

  function handleDisconnect(platformKey) {
    if (disconnectPlatform) {
      disconnectPlatform(platformKey);
    } else {
      setLocalConnected((prev) => ({ ...prev, [platformKey]: false }));
    }
    addToast(`${PLATFORMS.find((p) => p.key === platformKey)?.name} disconnected.`, 'info');
  }

  function handleEditProfile() {
    addToast('Profile updated!');
  }

  function handleDeleteAccount() {
    addToast('Account deletion is not available in demo mode', 'error');
  }

  function toggleNotification(key) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleInviteSubmit(e) {
    e.preventDefault();
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    setInviteSubmitting(true);
    try {
      const res = await inviteTeamMember({ name: inviteForm.name.trim(), email: inviteForm.email.trim(), role: inviteForm.role });
      const newMember = res.data?.data;
      if (newMember) {
        setTeamMembers((prev) => [...prev, newMember]);
      }
      addToast(`Invitation sent to ${inviteForm.email.trim()}`);
      setInviteForm({ name: '', email: '', role: 'viewer' });
      setShowInviteModal(false);
    } catch {
      addToast('Failed to send invitation', 'error');
    } finally {
      setInviteSubmitting(false);
    }
  }

  async function handleRemoveMember(member) {
    setRemovingId(member.id);
    try {
      await removeTeamMember(member.id);
      setTeamMembers((prev) => prev.filter((m) => m.id !== member.id));
      addToast(`${member.name} has been removed from the team`, 'info');
    } catch {
      addToast('Failed to remove team member', 'error');
    } finally {
      setRemovingId(null);
    }
  }

  // Build user initials from name
  const initials = user?.avatar || (user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'U');

  // Format role for display
  const displayRole = user?.role
    ? user.role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'User';

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account settings and connected platforms</p>
      </div>

      {/* User Info Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl font-bold">{initials}</span>
          </div>

          {/* User details */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-gray-900">{user?.name || 'User'}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{user?.email || 'user@glimmora.com'}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {displayRole}
              </span>
              {user?.company && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                  </svg>
                  {user.company}
                </span>
              )}
            </div>
          </div>

          {/* Edit button */}
          <Button variant="outline" size="sm" onClick={handleEditProfile}>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Connected Platforms Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Connected Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORMS.map((platform) => {
            const connected = isPlatformConnected(platform.key);
            const isGlimmora = platform.key === 'glimmora';
            return (
              <Card key={platform.key} className="flex flex-col items-center text-center">
                {/* Platform icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-3"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.letter}
                </div>

                {/* Platform name */}
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{platform.name}</h3>

                {/* Status badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium mb-4 ${
                    connected
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      connected ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                  {connected ? 'Connected' : 'Not Connected'}
                </span>

                {/* Action button */}
                {isGlimmora ? (
                  <span className="w-full py-2 px-4 text-sm font-medium text-gray-400 text-center">
                    Internal Ad Engine
                  </span>
                ) : connected ? (
                  <button
                    onClick={() => handleDisconnect(platform.key)}
                    className="w-full py-2 px-4 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition duration-200 cursor-pointer"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.key)}
                    className="w-full py-2 px-4 text-sm font-medium text-white rounded-lg transition hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: platform.color }}
                  >
                    Connect
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Team Members Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Team Members</h2>
          <Button size="sm" onClick={() => setShowInviteModal(true)}>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
            Invite Team Member
          </Button>
        </div>

        <Card>
          {teamLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-sm text-gray-500">Loading team members...</span>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
              <p className="text-sm text-gray-500">No team members yet.</p>
              <p className="text-xs text-gray-400 mt-1">Invite your first team member to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {teamMembers.map((member) => {
                const memberInitials = member.name
                  ? member.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                  : '??';
                const memberRole = member.role
                  ? member.role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                  : 'Viewer';
                const isActive = member.status === 'active';

                return (
                  <div key={member.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    {/* Member avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-600">{memberInitials}</span>
                    </div>

                    {/* Member info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                      <p className="text-xs text-gray-500 truncate">{member.email}</p>
                    </div>

                    {/* Role */}
                    <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {memberRole}
                    </span>

                    {/* Status badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                      />
                      {isActive ? 'Active' : 'Invited'}
                    </span>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveMember(member)}
                      disabled={removingId === member.id}
                      className="text-sm text-red-500 hover:text-red-700 font-medium transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {removingId === member.id ? (
                        <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin inline-block" />
                      ) : (
                        'Remove'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100 italic">
            Team invitations are simulated in demo mode
          </p>
        </Card>
      </div>

      {/* Account Settings Section */}
      <Card>
        <h2 className="text-lg font-bold text-gray-900 mb-5">Account Settings</h2>

        {/* Currency Preference */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency Preference</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white cursor-pointer w-full max-w-xs"
          >
            {SUPPORTED_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {CURRENCIES[code]?.symbol} {code} - {CURRENCIES[code]?.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1.5">All monetary values will be displayed in this currency</p>
        </div>

        {/* Notification Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Notification Preferences</label>
          <div className="space-y-3">
            {/* Email toggle */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                  <p className="text-xs text-gray-400">Receive campaign updates via email</p>
                </div>
              </div>
              <button
                onClick={() => toggleNotification('email')}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                  notifications.email ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    notifications.email ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Push toggle */}
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Push Notifications</p>
                  <p className="text-xs text-gray-400">Get real-time alerts in your browser</p>
                </div>
              </div>
              <button
                onClick={() => toggleNotification('push')}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                  notifications.push ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    notifications.push ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* SMS toggle */}
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">SMS Notifications</p>
                  <p className="text-xs text-gray-400">Receive critical alerts via text message</p>
                </div>
              </div>
              <button
                onClick={() => toggleNotification('sms')}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                  notifications.sms ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    notifications.sms ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition duration-200 cursor-pointer whitespace-nowrap"
          >
            Delete Account
          </button>
        </div>
      </Card>

      {/* Connect Platform Modal */}
      <ConnectPlatformModal
        platform={modalPlatform || 'google'}
        isOpen={modalPlatform !== null}
        onClose={() => setModalPlatform(null)}
        onConnect={handlePlatformConnected}
      />

      {/* Invite Team Member Modal */}
      {showInviteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => { if (e.target === e.currentTarget) setShowInviteModal(false); }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal header */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Invite Team Member</h2>
                  <div className="h-0.5 w-12 rounded-full mt-1" style={{ backgroundColor: '#6b4d3d' }} />
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal body */}
            <form onSubmit={handleInviteSubmit} className="px-6 py-5 space-y-4">
              {/* Name field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              {/* Role dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white cursor-pointer"
                >
                  {TEAM_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>

              {/* Demo note */}
              <p className="text-xs text-gray-400 italic">
                Team invitations are simulated in demo mode
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <Button type="submit" size="md" disabled={inviteSubmitting}>
                  {inviteSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Send Invitation'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
