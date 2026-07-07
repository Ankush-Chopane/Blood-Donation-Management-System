import React, { useEffect, useState } from 'react';
import {
  FiActivity,
  FiBell,
  FiChevronRight,
  FiClock,
  FiDroplet,
  FiGrid,
  FiHeart,
  FiMapPin,
  FiMenu,
  FiMoon,
  FiSearch,
  FiSettings,
  FiShield,
  FiSun,
  FiTrendingUp,
  FiUser,
  FiX,
  FiCheck,
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiList,
  FiEdit2,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiUsers
} from 'react-icons/fi';
import { FaHospital } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import api from '../services/api';
import toast from 'react-hot-toast';

const ROLE_META = {
  admin: {
    label: 'Admin Command',
    accent: 'from-rose-600 via-red-500 to-orange-400',
    icon: FiShield,
    welcome: 'Oversee national readiness, demand pressure, and platform health.'
  },
  donor: {
    label: 'Donor Pulse',
    accent: 'from-red-600 via-rose-500 to-pink-400',
    icon: FiHeart,
    welcome: 'Track eligibility, impact, and nearby opportunities to donate.'
  },
  recipient: {
    label: 'Recipient Care',
    accent: 'from-cyan-600 via-sky-500 to-blue-400',
    icon: FiDroplet,
    welcome: 'Monitor urgent requests, response speed, and support coverage.'
  },
  bank: {
    label: 'Blood Bank Ops',
    accent: 'from-amber-500 via-orange-500 to-rose-500',
    icon: FaHospital,
    welcome: 'Watch inventory health, expiry risk, and fulfillment flow in real time.'
  }
};

const TABS_BY_ROLE = {
  donor: [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'donor-profile', label: 'Donor Profile', icon: FiUser },
    { id: 'book-appointment', label: 'Appointments', icon: FiCalendar },
    { id: 'donation-history', label: 'Donation History', icon: FiList },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ],
  recipient: [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'recipient-profile', label: 'Recipient Profile', icon: FiUser },
    { id: 'blood-requests', label: 'Request Blood', icon: FiDroplet },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ],
  bank: [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'manage-inventory', label: 'Inventory', icon: FiDroplet },
    { id: 'bank-appointments', label: 'Donor Appointments', icon: FiCalendar },
    { id: 'fulfill-requests', label: 'Fulfill Requests', icon: FiActivity },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ],
  admin: [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'approve-donors', label: 'Approve Donors', icon: FiCheckCircle },
    { id: 'manage-banks', label: 'Blood Banks', icon: FaHospital },
    { id: 'audit-users', label: 'User Audit', icon: FiUsers },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ]
};

const toneClasses = {
  rose: 'from-rose-500/25 via-red-500/10 to-transparent text-rose-200 border-rose-400/20',
  amber: 'from-amber-500/25 via-orange-500/10 to-transparent text-amber-100 border-amber-400/20',
  emerald: 'from-emerald-500/25 via-lime-500/10 to-transparent text-emerald-100 border-emerald-400/20',
  sky: 'from-sky-500/25 via-cyan-500/10 to-transparent text-sky-100 border-sky-400/20'
};

const priorityClasses = {
  high: 'bg-rose-500/15 text-rose-200 border-rose-400/25',
  medium: 'bg-amber-500/15 text-amber-100 border-amber-400/25',
  normal: 'bg-sky-500/15 text-sky-100 border-sky-400/25'
};

const getInitials = (name = 'User') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

const formatTime = (value) => {
  if (!value) return 'Moments ago';
  try {
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleDateString();
  } catch (e) {
    return value;
  }
};

const MiniBarChart = ({ data, darkMode }) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="grid h-52 grid-cols-7 items-end gap-3">
      {data.map((item) => (
        <div key={item.label} className="flex h-full flex-col items-center justify-end gap-3">
          <div className={`flex w-full items-end justify-center rounded-t-[1.25rem] bg-gradient-to-t ${darkMode ? 'from-rose-500 via-orange-400 to-amber-300' : 'from-red-700 via-rose-500 to-orange-300'} shadow-[0_12px_30px_rgba(244,63,94,0.25)]`} style={{ height: `${Math.max((item.value / maxValue) * 100, 10)}%` }}>
            <span className="pb-3 text-xs font-semibold text-white/80">{item.value}</span>
          </div>
          <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ segments, darkMode }) => {
  let start = 0;
  const gradient = segments
    .map((segment) => {
      const end = start + segment.value;
      const slice = `${segment.color} ${start}% ${end}%`;
      start = end;
      return slice;
    })
    .join(', ');

  return (
    <div className="grid gap-6 lg:grid-cols-[220px,1fr] lg:items-center">
      <div className="mx-auto">
        <div
          className={`relative h-52 w-52 rounded-full border ${darkMode ? 'border-white/10' : 'border-slate-200'} shadow-[0_24px_60px_rgba(15,23,42,0.18)]`}
          style={{ background: `conic-gradient(${gradient || '#ef233c 0% 100%'})` }}
        >
          <div className={`absolute inset-[22%] rounded-full ${darkMode ? 'bg-slate-950' : 'bg-white'} flex flex-col items-center justify-center`}>
            <span className={`text-xs uppercase tracking-[0.28em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Stock</span>
            <span className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>100%</span>
          </div>
        </div>
      </div>
      <div className="grid gap-3">
        {segments.map((segment) => (
          <div key={segment.label} className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${darkMode ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex items-center gap-3">
              <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: segment.color }} />
              <span className={`font-medium ${darkMode ? 'text-slate-100' : 'text-slate-700'}`}>{segment.label}</span>
            </div>
            <span className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>{segment.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalyticsCard = ({ card, darkMode }) => (
  <div className={`rounded-[1.75rem] border bg-gradient-to-br p-5 backdrop-blur-xl ${toneClasses[card.tone] || toneClasses.rose} ${darkMode ? 'bg-slate-900/80' : 'bg-white/90'}`}>
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <p className={`text-xs uppercase tracking-[0.25em] ${darkMode ? 'text-white/50' : 'text-slate-500'}`}>{card.label}</p>
        <h3 className={`mt-3 text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{card.value}</h3>
      </div>
      <div className={`rounded-2xl border px-3 py-2 text-sm font-semibold ${darkMode ? 'border-white/10 bg-white/5 text-white/70' : 'border-slate-200 bg-white text-slate-600'}`}>
        {card.delta}
      </div>
    </div>
    <div className={`h-1.5 rounded-full ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
      <div className={`h-full rounded-full bg-gradient-to-r ${card.tone === 'rose' ? 'from-rose-500 to-orange-400' : card.tone === 'amber' ? 'from-amber-400 to-orange-300' : card.tone === 'emerald' ? 'from-emerald-400 to-lime-300' : 'from-sky-500 to-cyan-300'}`} style={{ width: '72%' }} />
    </div>
  </div>
);

const SectionCard = ({ title, kicker, children, darkMode, action }) => (
  <section className={`rounded-[2rem] border p-6 shadow-[0_30px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl ${darkMode ? 'border-white/10 bg-slate-900/[0.72]' : 'border-slate-200 bg-white/[0.86]'}`}>
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker ? <p className={`text-xs uppercase tracking-[0.3em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{kicker}</p> : null}
        <h2 className={`mt-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
      </div>
      {action}
    </div>
    {children}
  </section>
);

const ActivityList = ({ items, darkMode }) => (
  <div className="grid gap-3">
    {items.length === 0 ? (
      <div className={`rounded-[1.5rem] border p-5 text-center ${darkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
        No recent activity logged.
      </div>
    ) : (
      items.map((item, idx) => (
        <div key={`${item.title}-${idx}`} className={`rounded-[1.5rem] border p-4 ${darkMode ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-slate-50/80'}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
              <p className={`mt-1 text-sm leading-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.detail}</p>
            </div>
            <span className={`whitespace-nowrap text-xs font-semibold uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{formatTime(item.time)}</span>
          </div>
        </div>
      ))
    )}
  </div>
);

const NotificationList = ({ items, darkMode, compact = false }) => (
  <div className="grid gap-3">
    {items.length === 0 ? (
      <div className={`rounded-[1.5rem] border p-5 text-center ${darkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
        No notifications in your inbox.
      </div>
    ) : (
      items.map((item, idx) => (
        <div key={`${item.title}-${idx}`} className={`rounded-[1.5rem] border p-4 ${darkMode ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-slate-50/80'}`}>
          <div className={`mb-3 inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${priorityClasses[item.priority] || priorityClasses.normal}`}>
            {item.priority}
          </div>
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
          <p className={`mt-1 ${compact ? 'text-sm' : 'text-sm leading-6'} ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.detail}</p>
        </div>
      ))
    )}
  </div>
);

const Dashboard = () => {
  const { user, API_URL, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const roleKey = user?.role || 'donor';
  const roleMeta = ROLE_META[roleKey] || ROLE_META.donor;
  const RoleIcon = roleMeta.icon;

  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Loaded database entities
  const [donorProfile, setDonorProfile] = useState(null);
  const [recipientProfile, setRecipientProfile] = useState(null);
  const [myBank, setMyBank] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [donations, setDonations] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Admin lists
  const [allBanks, setAllBanks] = useState([]);
  const [allDonors, setAllDonors] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Loading indicator
  const [pageLoading, setPageLoading] = useState(true);

  // Forms and Modals State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [drawBloodModalOpen, setDrawBloodModalOpen] = useState(false);
  const [allocateModalOpen, setAllocateModalOpen] = useState(false);
  const [bankModalOpen, setBankModalOpen] = useState(false);

  // Form input fields local states
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Donor form
  const [donorForm, setDonorForm] = useState({
    bloodType: 'O+',
    contactNumber: '',
    addressLine: '',
    city: '',
    state: '',
    zipCode: '',
    availability: 'available'
  });

  // Recipient form
  const [recipientForm, setRecipientForm] = useState({
    bloodType: 'A+',
    contactNumber: '',
    hospitalName: '',
    city: '',
    zipCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    medicalHistory: ''
  });

  // Request form
  const [requestForm, setRequestForm] = useState({
    recipientName: '',
    bloodTypeNeeded: 'O+',
    unitsNeeded: 1,
    hospitalName: '',
    city: '',
    contactPhone: '',
    urgency: 'medium',
    notes: '',
    neededBy: ''
  });

  // Appointment Form
  const [appointmentForm, setAppointmentForm] = useState({
    bloodBank: '',
    appointmentDate: '',
    notes: ''
  });

  // Inventory Batch Form
  const [inventoryForm, setInventoryForm] = useState({
    bloodType: 'O+',
    component: 'whole_blood',
    units: 1,
    batchNumber: '',
    expiryDate: '',
    storageLocation: ''
  });

  // Draw Blood Check-In Form
  const [drawBloodForm, setDrawBloodForm] = useState({
    component: 'whole_blood',
    units: 1,
    batchNumber: '',
    expiryDate: '',
    storageLocation: 'Fridge-Draw-A'
  });

  // Admin New Bank Form
  const [newBankForm, setNewBankForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    contactNumber: '',
    email: '',
    licenseNumber: '',
    user: ''
  });

  // Aggregated Stats display
  const [stats, setStats] = useState([
    { label: 'Units Stocked', value: '0', delta: 'N/A', tone: 'rose' },
    { label: 'Pending Issues', value: '0', delta: 'Live count', tone: 'amber' },
    { label: 'Eligibility', value: 'Ready', delta: 'Check window', tone: 'emerald' },
    { label: 'Network Coverage', value: '0', delta: 'Active banks', tone: 'sky' }
  ]);

  const loadData = async () => {
    if (!user) return;
    setPageLoading(true);
    try {
      // 1. Load Notifications (all roles)
      const notifRes = await api.get('/notifications?limit=15');
      if (notifRes.data.success) {
        setNotifications(notifRes.data.data || []);
      }

      // 2. Fetch data depending on user role
      if (roleKey === 'donor') {
        // Fetch Donor profile
        try {
          const profileRes = await api.get('/donors/me');
          if (profileRes.data.success && profileRes.data.data) {
            setDonorProfile(profileRes.data.data);
            setDonorForm({
              bloodType: profileRes.data.data.bloodType || 'O+',
              contactNumber: profileRes.data.data.contactNumber || '',
              addressLine: profileRes.data.data.addressLine || '',
              city: profileRes.data.data.city || '',
              state: profileRes.data.data.state || '',
              zipCode: profileRes.data.data.zipCode || '',
              availability: profileRes.data.data.availability || 'available'
            });
          }
        } catch (e) {
          if (e.response?.status === 404) {
            setDonorProfile(null);
          }
        }

        // Fetch Donor appointments
        const apptRes = await api.get('/appointments?limit=30');
        if (apptRes.data.success) {
          setAppointments(apptRes.data.data || []);
        }

        // Fetch Donor donations
        const donRes = await api.get('/donations?limit=30');
        if (donRes.data.success) {
          setDonations(donRes.data.data || []);
        }

        // Fetch compatible open blood requests nearby
        const reqRes = await api.get('/requests?status=pending');
        if (reqRes.data.success) {
          setRequests(reqRes.data.data || []);
        }

        // Fetch Blood Banks list for appointment bookings
        const bankRes = await api.get('/banks?limit=50');
        if (bankRes.data.success) {
          setAllBanks(bankRes.data.data || []);
        }
      }

      if (roleKey === 'recipient') {
        // Fetch Recipient Profile
        try {
          const profileRes = await api.get('/recipients/me');
          if (profileRes.data.success && profileRes.data.data) {
            setRecipientProfile(profileRes.data.data);
            setRecipientForm({
              bloodType: profileRes.data.data.bloodType || 'A+',
              contactNumber: profileRes.data.data.contactNumber || '',
              hospitalName: profileRes.data.data.hospitalName || '',
              city: profileRes.data.data.city || '',
              zipCode: profileRes.data.data.zipCode || '',
              emergencyContactName: profileRes.data.data.emergencyContactName || '',
              emergencyContactPhone: profileRes.data.data.emergencyContactPhone || '',
              medicalHistory: profileRes.data.data.medicalHistory || ''
            });

            // Prefill requests form defaults
            setRequestForm((prev) => ({
              ...prev,
              recipientName: user.name,
              hospitalName: profileRes.data.data.hospitalName || '',
              city: profileRes.data.data.city || '',
              contactPhone: profileRes.data.data.contactNumber || '',
              bloodTypeNeeded: profileRes.data.data.bloodType || 'O+'
            }));
          }
        } catch (e) {
          if (e.response?.status === 404) {
            setRecipientProfile(null);
          }
        }

        // Fetch Recipient's own requests
        const reqRes = await api.get('/requests');
        if (reqRes.data.success) {
          // Filter by requestedBy user ID
          const myReqs = (reqRes.data.data || []).filter(
            (r) => r.requestedBy === user.id || r.requestedBy?._id === user.id
          );
          setRequests(myReqs);
        }

        // Fetch Blood Banks list for coverage
        const bankRes = await api.get('/banks?limit=50');
        if (bankRes.data.success) {
          setAllBanks(bankRes.data.data || []);
        }
      }

      if (roleKey === 'bank') {
        // Fetch all blood banks to find the managed one
        const bankRes = await api.get('/banks?limit=50');
        if (bankRes.data.success && bankRes.data.data) {
          const currentBank = bankRes.data.data.find(
            (b) => b.user === user.id || b.user?._id === user.id
          );
          if (currentBank) {
            setMyBank(currentBank);

            // Fetch this blood bank's inventory
            const invRes = await api.get(`/inventory?bloodBank=${currentBank._id}&limit=50`);
            if (invRes.data.success) {
              setInventory(invRes.data.data || []);
            }

            // Fetch appointments booked for this bank
            const apptRes = await api.get(`/appointments?bloodBank=${currentBank._id}&limit=50`);
            if (apptRes.data.success) {
              setAppointments(apptRes.data.data || []);
            }

            // Fetch requests matching the bank's city location
            const reqRes = await api.get(`/requests?city=${currentBank.city}`);
            if (reqRes.data.success) {
              setRequests(reqRes.data.data || []);
            }
          }
        }
      }

      if (roleKey === 'admin') {
        // Fetch Admin dashboard summary numbers
        const summaryRes = await api.get('/admin/dashboard');
        if (summaryRes.data.success) {
          const sums = summaryRes.data.data.totals;
          setStats([
            { label: 'Active Users', value: `${sums.users}`, delta: 'Global network', tone: 'sky' },
            { label: 'Open Requests', value: `${sums.pendingRequests}`, delta: `${sums.requests} total`, tone: 'amber' },
            { label: 'Total Inventory', value: `${sums.availableInventoryUnits} units`, delta: 'Available', tone: 'emerald' },
            { label: 'Blood Banks', value: `${sums.bloodBanks}`, delta: 'Live facilities', tone: 'rose' }
          ]);
        }

        // Fetch all blood banks
        const bankRes = await api.get('/banks?limit=100');
        if (bankRes.data.success) {
          setAllBanks(bankRes.data.data || []);
        }

        // Fetch all donors (to approve)
        const donorRes = await api.get('/donors?limit=100');
        if (donorRes.data.success) {
          setAllDonors(donorRes.data.data || []);
        }

        // Fetch users list from dashboard activity audit
        const actRes = await api.get('/admin/dashboard/activity');
        if (actRes.data.success) {
          setAllUsers(actRes.data.data.latestUsers || []);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      toast.error('Failed to sync latest database records');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [roleKey]);

  // Recalculate stats dynamically for Non-Admin roles
  useEffect(() => {
    if (roleKey === 'donor') {
      const eligibleStr = donorProfile?.isEligible ? 'Ready' : 'Resting';
      const lastDonDate = donorProfile?.lastDonationDate
        ? new Date(donorProfile.lastDonationDate).toLocaleDateString()
        : 'Never';
      setStats([
        { label: 'Lives Impacted', value: `${(donorProfile?.totalDonations || 0) * 3}`, delta: 'Approximate support', tone: 'rose' },
        { label: 'Donations Made', value: `${donorProfile?.totalDonations || 0} times`, delta: `Last: ${lastDonDate}`, tone: 'emerald' },
        { label: 'Eligibility Status', value: eligibleStr, delta: donorProfile?.availability || 'available', tone: 'amber' },
        { label: 'Nearby Requests', value: `${requests.filter((r) => r.status === 'pending').length} open`, delta: 'Same blood group', tone: 'sky' }
      ]);
    } else if (roleKey === 'recipient') {
      const activeCount = requests.filter((r) => ['pending', 'matched'].includes(r.status)).length;
      const fulfilledCount = requests.filter((r) => r.status === 'fulfilled').length;
      setStats([
        { label: 'Active Requests', value: `${activeCount}`, delta: 'Awaiting donors', tone: 'rose' },
        { label: 'Fulfillments', value: `${fulfilledCount}`, delta: 'Success deliveries', tone: 'emerald' },
        { label: 'Blood Group Needs', value: recipientProfile?.bloodType || 'A+', delta: recipientProfile?.hospitalName || 'SF General', tone: 'amber' },
        { label: 'Partner Banks', value: `${allBanks.length}`, delta: 'Nearby in network', tone: 'sky' }
      ]);
    } else if (roleKey === 'bank') {
      const stockSum = inventory.reduce((acc, curr) => (['available', 'reserved'].includes(curr.status) ? acc + curr.units : acc), 0);
      const pendingJobs = appointments.filter((a) => a.status === 'pending').length;
      const criticalReqs = requests.filter((r) => r.status === 'pending' && r.urgency === 'critical').length;
      setStats([
        { label: 'Available Stock', value: `${stockSum} Units`, delta: 'Across batches', tone: 'emerald' },
        { label: 'Pending Donor Bookings', value: `${pendingJobs}`, delta: 'Needs approval', tone: 'sky' },
        { label: 'Critical Requests', value: `${criticalReqs}`, delta: 'Immediate need in city', tone: 'rose' },
        { label: 'Expiring Batches', value: `${inventory.filter((i) => i.status === 'available' && new Date(i.expiryDate) < new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)).length}`, delta: 'Under 5 days', tone: 'amber' }
      ]);
    }
  }, [donorProfile, recipientProfile, myBank, appointments, donations, inventory, requests, allBanks]);

  // Form Submissions
  const handleDonorProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (donorProfile) {
        res = await api.put(`/donors/${donorProfile._id}`, donorForm);
      } else {
        res = await api.post('/donors', donorForm);
      }
      if (res.data.success) {
        toast.success('Donor profile updated successfully!');
        loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating donor profile');
    }
  };

  const handleRecipientProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (recipientProfile) {
        res = await api.put(`/recipients/${recipientProfile._id}`, recipientForm);
      } else {
        res = await api.post('/recipients', recipientForm);
      }
      if (res.data.success) {
        toast.success('Recipient profile saved successfully!');
        loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating recipient profile');
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!donorProfile) {
      toast.error('You must set up your donor profile details first!');
      return;
    }
    if (donorProfile.approvalStatus !== 'approved') {
      toast.error('Your donor profile must be approved by admin before booking appointments.');
      return;
    }
    try {
      const res = await api.post('/appointments', appointmentForm);
      if (res.data.success) {
        toast.success('Donation appointment requested successfully!');
        setBookingModalOpen(false);
        setAppointmentForm({ bloodBank: '', appointmentDate: '', notes: '' });
        loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  const handleCreateBloodRequest = async (e) => {
    e.preventDefault();
    if (!recipientProfile) {
      toast.error('Please configure your Recipient Profile prior to posting blood requests.');
      return;
    }
    try {
      const formattedDate = requestForm.neededBy ? new Date(requestForm.neededBy).toISOString() : null;
      const res = await api.post('/requests', {
        ...requestForm,
        neededBy: formattedDate
      });
      if (res.data.success) {
        toast.success('Emergency blood request published to system matching engine!');
        setRequestForm({
          recipientName: user.name,
          bloodTypeNeeded: recipientProfile.bloodType || 'O+',
          unitsNeeded: 1,
          hospitalName: recipientProfile.hospitalName || '',
          city: recipientProfile.city || '',
          contactPhone: recipientProfile.contactNumber || '',
          urgency: 'medium',
          notes: '',
          neededBy: ''
        });
        loadData();
        setActiveTab('blood-requests');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create blood request');
    }
  };

  const handleCancelRequest = async (id) => {
    if (!window.confirm('Are you sure you want to retract this emergency request?')) return;
    try {
      const res = await api.put(`/requests/${id}`, { status: 'cancelled', note: 'Retracted by recipient' });
      if (res.data.success) {
        toast.success('Blood request cancelled.');
        loadData();
      }
    } catch (err) {
      toast.error('Failed to update request');
    }
  };

  const handleMarkRequestFulfilled = async (id) => {
    try {
      const res = await api.put(`/requests/${id}`, { status: 'fulfilled', note: 'Marked fulfilled by recipient' });
      if (res.data.success) {
        toast.success('Blood request marked as fulfilled!');
        loadData();
      }
    } catch (err) {
      toast.error('Failed to update request');
    }
  };

  // Blood Bank Operations
  const handleAddInventory = async (e) => {
    e.preventDefault();
    if (!myBank) return;
    try {
      const res = await api.post('/inventory', {
        ...inventoryForm,
        bloodBank: myBank._id
      });
      if (res.data.success) {
        toast.success('Batch added to active inventory!');
        setInventoryModalOpen(false);
        setInventoryForm({
          bloodType: 'O+',
          component: 'whole_blood',
          units: 1,
          batchNumber: '',
          expiryDate: '',
          storageLocation: ''
        });
        loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error inserting batch');
    }
  };

  const handleDeleteInventory = async (id) => {
    if (!window.confirm('Are you sure you want to discard this inventory record?')) return;
    try {
      await api.delete(`/inventory/${id}`);
      toast.success('Batch discarded from system database.');
      loadData();
    } catch (err) {
      toast.error('Failed to delete batch.');
    }
  };

  const handleUpdateInventoryStatus = async (id, status) => {
    try {
      const res = await api.put(`/inventory/${id}`, { status });
      if (res.data.success) {
        toast.success(`Inventory batch marked as ${status}`);
        loadData();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleApproveAppointment = async (id) => {
    try {
      const res = await api.put(`/appointments/${id}`, { status: 'approved' });
      if (res.data.success) {
        toast.success('Appointment booking approved. Notifying donor...');
        loadData();
      }
    } catch (err) {
      toast.error('Failed to approve appointment');
    }
  };

  const handleRejectAppointment = async (id) => {
    const reason = window.prompt('Please specify rejection reason for donor:');
    if (reason === null) return;
    try {
      const res = await api.put(`/appointments/${id}`, { status: 'rejected', rejectionReason: reason || 'Facility at capacity' });
      if (res.data.success) {
        toast.success('Appointment declined.');
        loadData();
      }
    } catch (err) {
      toast.error('Failed to decline appointment');
    }
  };

  // Perform draw blood check-in
  const handleDrawBloodSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointment || !myBank) return;
    try {
      const donorName = selectedAppointment.donor?.name || 'Donor';
      const bloodType = selectedAppointment.donorProfile?.bloodType || 'O+';

      // 1. Create inventory batch
      const invRes = await api.post('/inventory', {
        bloodBank: myBank._id,
        bloodType: bloodType,
        component: drawBloodForm.component,
        units: drawBloodForm.units,
        batchNumber: drawBloodForm.batchNumber,
        expiryDate: drawBloodForm.expiryDate,
        storageLocation: drawBloodForm.storageLocation,
        status: 'available'
      });

      if (!invRes.data.success) throw new Error('Inventory creation failed');
      const inventoryId = invRes.data.data?._id;

      // 2. Create verified donation history
      const donRes = await api.post('/donations', {
        donor: selectedAppointment.donor?._id,
        donorProfile: selectedAppointment.donorProfile?._id,
        bloodBank: myBank._id,
        bloodType: bloodType,
        unitsDonated: drawBloodForm.units,
        inventoryItem: inventoryId,
        donationDate: new Date(),
        status: 'pending',
        notes: `Appointment checked-in. Automated donation draw for batch ${drawBloodForm.batchNumber}.`
      });

      if (!donRes.data.success) throw new Error('Donation record logging failed');
      const donationId = donRes.data.data?._id;

      // Approve donation to increment donor profile stats
      await api.put(`/donations/${donationId}`, { status: 'approved' });

      // 3. Mark appointment as completed
      await api.put(`/appointments/${selectedAppointment._id}`, { status: 'completed' });

      toast.success(`Check-in complete! Drew ${drawBloodForm.units} unit of ${bloodType} from ${donorName}.`);
      setDrawBloodModalOpen(false);
      setDrawBloodForm({
        component: 'whole_blood',
        units: 1,
        batchNumber: '',
        expiryDate: '',
        storageLocation: 'Fridge-Draw-A'
      });
      loadData();
    } catch (err) {
      toast.error(err.message || 'Verification draw flow failed.');
    }
  };

  // Fulfill request by blood bank allocating batch
  const handleFulfillRequestWithBatch = async (requestId, inventoryId) => {
    if (!myBank) return;
    try {
      const request = requests.find((r) => r._id === requestId);
      if (!request) return;

      // Update inventory status to transfused
      await api.put(`/inventory/${inventoryId}`, {
        status: 'transfused',
        reservedFor: requestId
      });

      // Update blood request status to fulfilled
      await api.put(`/requests/${requestId}`, {
        status: 'fulfilled',
        unitsFulfilled: request.unitsNeeded,
        assignedBloodBank: myBank._id,
        note: `Blood units allocated and fulfilled by ${myBank.name}`
      });

      toast.success('Emergency blood request successfully fulfilled and units dispatched!');
      setAllocateModalOpen(false);
      loadData();
    } catch (err) {
      toast.error('Failed to complete dispatch fulfillment.');
    }
  };

  // Admin Actions
  const handleApproveDonorProfile = async (id) => {
    try {
      const res = await api.patch(`/donors/${id}/approval`, { approvalStatus: 'approved' });
      if (res.data.success) {
        toast.success('Donor profile approved successfully!');
        loadData();
      }
    } catch (err) {
      toast.error('Failed to approve donor.');
    }
  };

  const handleRejectDonorProfile = async (id) => {
    const reason = window.prompt('Specify rejection reason:');
    if (reason === null) return;
    try {
      const res = await api.patch(`/donors/${id}/approval`, {
        approvalStatus: 'rejected',
        rejectionReason: reason || 'Incorrect information provided.'
      });
      if (res.data.success) {
        toast.success('Donor profile rejected.');
        loadData();
      }
    } catch (err) {
      toast.error('Failed to reject donor profile.');
    }
  };

  const handleCreateBloodBank = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/banks', newBankForm);
      if (res.data.success) {
        toast.success('New Blood Bank registered successfully!');
        setBankModalOpen(false);
        setNewBankForm({
          name: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          contactNumber: '',
          email: '',
          licenseNumber: '',
          user: ''
        });
        loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register blood bank');
    }
  };

  // Filter lists based on search headers
  const query = searchText.trim().toLowerCase();

  const filteredActivity = query
    ? (donations.map((d) => ({ title: `Donation: ${d.bloodType}`, time: d.donationDate, detail: `Drew ${d.unitsDonated} unit(s) at ${d.bloodBank?.name || 'facility'}` }))
      .concat(appointments.map((a) => ({ title: `Appointment: ${a.status}`, time: a.appointmentDate, detail: `Scheduled at ${a.bloodBank?.name}` })))
      .filter((item) => item.title.toLowerCase().includes(query) || item.detail.toLowerCase().includes(query)))
    : [];

  const unreadNotificationsCount = notifications.length;

  if (!user) return null;

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className={`relative min-h-screen overflow-hidden ${isDark ? 'bg-[#07111f] text-white' : 'bg-[#f4f7fb] text-slate-900'}`}>
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-0">
          <div className={`absolute left-[-8%] top-[-8%] h-72 w-72 rounded-full blur-3xl ${isDark ? 'bg-rose-500/[0.18]' : 'bg-rose-300/55'}`} />
          <div className={`absolute right-[-5%] top-[10%] h-80 w-80 rounded-full blur-3xl ${isDark ? 'bg-cyan-500/[0.14]' : 'bg-sky-200/70'}`} />
          <div className={`absolute bottom-[-10%] left-[20%] h-96 w-96 rounded-full blur-3xl ${isDark ? 'bg-orange-500/10' : 'bg-amber-200/60'}`} />
          <div className={`${isDark ? 'opacity-[0.16]' : 'opacity-[0.45]'} absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_38%)]`} />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-[1680px]">
          {/* Dashboard Sidebar */}
          <aside className={`fixed inset-y-0 left-0 z-40 w-[288px] transform p-4 transition-transform duration-300 lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className={`flex h-full flex-col rounded-[2rem] border px-5 py-6 backdrop-blur-2xl ${isDark ? 'border-white/10 bg-slate-950/[0.78]' : 'border-white/70 bg-white/[0.85]'}`}>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className={`text-xs uppercase tracking-[0.35em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>BloodConnect</p>
                  <h1 className={`mt-2 text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{roleMeta.label}</h1>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-2xl p-2 lg:hidden ${isDark ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  <FiX />
                </button>
              </div>

              {/* User badge */}
              <div className={`mb-8 rounded-[1.75rem] bg-gradient-to-br ${roleMeta.accent} p-5 text-white shadow-[0_30px_60px_rgba(15,23,42,0.28)]`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/70">Role</p>
                    <h2 className="mt-2 text-lg font-bold">{roleMeta.label}</h2>
                  </div>
                  <div className="rounded-2xl bg-white/15 p-3">
                    <RoleIcon className="text-xl" />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/80">{roleMeta.welcome}</p>
              </div>

              {/* Navigation Links */}
              <nav className="grid gap-2">
                {(TABS_BY_ROLE[roleKey] || TABS_BY_ROLE.donor).map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileOpen(false);
                      }}
                      className={`group flex items-center justify-between rounded-[1.4rem] px-4 py-3.5 text-left transition-all ${isActive ? `bg-gradient-to-r ${roleMeta.accent} text-white shadow-[0_16px_30px_rgba(244,63,94,0.24)]` : isDark ? 'text-slate-300 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`rounded-2xl p-2 ${isActive ? 'bg-white/15' : isDark ? 'bg-white/5' : 'bg-white'}`}>
                          <Icon />
                        </span>
                        <span className="font-medium">{tab.label}</span>
                      </span>
                      <FiChevronRight className={`${isActive ? 'opacity-100' : 'opacity-0 transition-opacity group-hover:opacity-100'}`} />
                    </button>
                  );
                })}
              </nav>

              {/* Sidebar Footer */}
              <div className={`mt-auto rounded-[1.75rem] border p-4 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-slate-50/80'}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-gradient-to-br ${roleMeta.accent} font-black text-white`}>
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <p className={`truncate font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
                    <p className={`truncate text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className={`mt-4 w-full rounded-[1.1rem] px-4 py-3 text-sm font-semibold ${isDark ? 'bg-white/[0.06] text-white hover:bg-white/10' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {mobileOpen && (
            <button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
          )}

          {/* Main Content Area */}
          <div className="min-w-0 flex-1 px-4 py-4 lg:px-6 lg:py-6">
            <div className={`rounded-[2.2rem] border px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8 ${isDark ? 'border-white/10 bg-slate-950/50' : 'border-white/70 bg-white/[0.72]'}`}>
              {/* Header */}
              <header className="mb-8 flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setMobileOpen(true)}
                      className={`rounded-2xl p-3 lg:hidden ${isDark ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      <FiMenu />
                    </button>
                    <div>
                      <p className={`text-xs uppercase tracking-[0.32em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Workspace</p>
                      <h2 className={`mt-2 text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Welcome, {user.name.split(' ')[0]}</h2>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className={`flex items-center gap-3 rounded-[1.2rem] border px-4 py-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-white'}`}>
                    <FiSearch className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                    <input
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search appointments..."
                      className={`w-52 bg-transparent text-sm outline-none sm:w-64 ${isDark ? 'placeholder:text-slate-500 text-white' : 'placeholder:text-slate-400 text-slate-800'}`}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={`rounded-[1.2rem] border p-3 ${isDark ? 'border-white/10 bg-white/[0.04] text-white' : 'border-slate-200 bg-white text-slate-700'}`}
                  >
                    {isDark ? <FiSun /> : <FiMoon />}
                  </button>

                  <div className={`flex items-center gap-3 rounded-[1.2rem] border px-4 py-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-white'}`}>
                    <div className="relative">
                      <FiBell className={isDark ? 'text-slate-300' : 'text-slate-600'} />
                      <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                        {unreadNotificationsCount}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Alerts</span>
                  </div>
                </div>
              </header>

              {pageLoading ? (
                <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
                  <p className="font-heading font-semibold text-lg">Synchronizing secure database flow...</p>
                </div>
              ) : (
                <>
                  {/* Dynamic Tab Panes */}

                  {/* 1. OVERVIEW TAB */}
                  {activeTab === 'overview' && (
                    <div className="grid gap-6">
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {stats.map((card) => (
                          <AnalyticsCard key={card.label} card={card} darkMode={isDark} />
                        ))}
                      </div>

                      {roleKey === 'donor' && (
                        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
                          <SectionCard title="Emergency Requests Compatible With Your Blood Group" kicker="Alert Desk" darkMode={isDark}>
                            <div className="grid gap-3">
                              {requests.filter((r) => r.status === 'pending' && r.bloodTypeNeeded === donorProfile?.bloodType).length === 0 ? (
                                <div className={`p-6 text-center rounded-2xl border ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                                  No compatible emergency requests nearby. You are doing great!
                                </div>
                              ) : (
                                requests
                                  .filter((r) => r.status === 'pending' && r.bloodTypeNeeded === donorProfile?.bloodType)
                                  .map((req) => (
                                    <div key={req._id} className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'}`}>
                                      <div>
                                        <span className={`inline-flex rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider mb-2 ${req.urgency === 'critical' ? 'bg-red-500/20 text-red-300' : 'bg-orange-500/20 text-orange-300'}`}>
                                          {req.urgency} Urgency
                                        </span>
                                        <h4 className="font-bold text-lg">{req.unitsNeeded} Units of {req.bloodTypeNeeded} Needed</h4>
                                        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{req.hospitalName}, {req.city}</p>
                                        {req.notes && <p className="text-xs mt-2 text-rose-400 italic">"{req.notes}"</p>}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setAppointmentForm((prev) => ({ ...prev, notes: `Responding to compatible request ${req.requestCode || ''}` }));
                                          setActiveTab('book-appointment');
                                        }}
                                        className="py-2.5 px-5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-sm"
                                      >
                                        Schedule Donation
                                      </button>
                                    </div>
                                  ))
                              )}
                            </div>
                          </SectionCard>

                          <SectionCard title="Your Donation Health" kicker="Pulse" darkMode={isDark}>
                            {donorProfile ? (
                              <div className="flex flex-col gap-4">
                                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                  <p className="text-xs uppercase tracking-wider text-slate-500">Eligibility Window</p>
                                  <h4 className="font-black text-xl mt-1 text-emerald-400">
                                    {donorProfile.isEligible ? 'Eligible to Donate Whole Blood' : 'In Resting Period'}
                                  </h4>
                                  {donorProfile.nextEligibleDate && (
                                    <p className="text-xs text-slate-400 mt-1">
                                      Next window open: {new Date(donorProfile.nextEligibleDate).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                  <p className="text-xs uppercase tracking-wider text-slate-500">Approval State</p>
                                  <h4 className={`font-black text-xl mt-1 uppercase ${donorProfile.approvalStatus === 'approved' ? 'text-emerald-400' : donorProfile.approvalStatus === 'rejected' ? 'text-red-400' : 'text-amber-400'}`}>
                                    {donorProfile.approvalStatus}
                                  </h4>
                                  {donorProfile.rejectionReason && (
                                    <p className="text-xs text-red-300 mt-1">Reason: {donorProfile.rejectionReason}</p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center p-4">
                                <p className="text-sm text-slate-400 mb-4">Complete your donor parameters before scheduling.</p>
                                <button
                                  type="button"
                                  onClick={() => setActiveTab('donor-profile')}
                                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm"
                                >
                                  Setup Donor Profile
                                </button>
                              </div>
                            )}
                          </SectionCard>
                        </div>
                      )}

                      {roleKey === 'recipient' && (
                        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
                          <SectionCard title="Active Emergency Requests Submitted By You" kicker="My Requests" darkMode={isDark}>
                            <div className="grid gap-3">
                              {requests.length === 0 ? (
                                <div className={`p-6 text-center rounded-2xl border ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                                  No active requests. Publish a new request below.
                                </div>
                              ) : (
                                requests.map((req) => (
                                  <div key={req._id} className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'}`}>
                                    <div>
                                      <div className="flex items-center gap-3">
                                        <span className={`inline-flex rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${req.status === 'fulfilled' ? 'bg-emerald-500/20 text-emerald-300' : req.status === 'cancelled' ? 'bg-slate-500/20 text-slate-300' : 'bg-rose-500/20 text-rose-300'}`}>
                                          {req.status}
                                        </span>
                                        <span className="text-xs uppercase text-slate-500 font-bold">{req.requestCode}</span>
                                      </div>
                                      <h4 className="font-bold text-lg mt-2">{req.unitsNeeded} Units of {req.bloodTypeNeeded}</h4>
                                      <p className="text-sm mt-1 text-slate-400">{req.hospitalName}</p>
                                    </div>
                                    <div className="flex gap-2">
                                      {['pending', 'matched'].includes(req.status) && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => handleMarkRequestFulfilled(req._id)}
                                            className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                                          >
                                            Fulfill
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleCancelRequest(req._id)}
                                            className="py-2 px-4 bg-slate-600 hover:bg-slate-500 text-white rounded-xl text-xs font-bold"
                                          >
                                            Retract
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </SectionCard>

                          <SectionCard title="Blood Banks Network Status" kicker="Hospitals & Banks" darkMode={isDark}>
                            <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
                              {allBanks.map((bank) => (
                                <div key={bank._id} className={`p-4 rounded-xl border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                                  <h4 className="font-bold">{bank.name}</h4>
                                  <p className="text-xs text-slate-400 mt-1">{bank.address}, {bank.city}</p>
                                  <p className="text-xs text-rose-400 font-bold mt-2">Ph: {bank.contactNumber}</p>
                                </div>
                              ))}
                            </div>
                          </SectionCard>
                        </div>
                      )}

                      {roleKey === 'bank' && (
                        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
                          <SectionCard title="Urgent Fulfillments Needed Nearby" kicker="Dispatch Queue" darkMode={isDark}>
                            <div className="grid gap-3">
                              {requests.filter((r) => r.status === 'pending').length === 0 ? (
                                <div className={`p-6 text-center rounded-2xl border ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                                  No open blood requests in your city ({myBank?.city}).
                                </div>
                              ) : (
                                requests
                                  .filter((r) => r.status === 'pending')
                                  .map((req) => (
                                    <div key={req._id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'}`}>
                                      <div>
                                        <div className="flex gap-2">
                                          <span className="bg-red-500/20 text-red-300 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                                            {req.urgency}
                                          </span>
                                          <span className="text-[10px] font-bold text-slate-500">{req.requestCode}</span>
                                        </div>
                                        <h4 className="font-bold text-lg mt-1">{req.unitsNeeded} Units of {req.bloodTypeNeeded}</h4>
                                        <p className="text-xs text-slate-400">{req.recipientName} • {req.hospitalName}</p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedRequest(req);
                                          setAllocateModalOpen(true);
                                        }}
                                        className="py-2 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold"
                                      >
                                        Allocate & Fulfill
                                      </button>
                                    </div>
                                  ))
                              )}
                            </div>
                          </SectionCard>

                          <SectionCard title="Cold Storage Batches summary" kicker="Storage Units" darkMode={isDark}>
                            {myBank ? (
                              <div className="grid gap-3">
                                {Object.entries(myBank.inventory || {}).map(([bloodType, count]) => (
                                  <div key={bloodType} className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                                    <span className="font-bold text-lg text-rose-500">{bloodType}</span>
                                    <span className="font-bold text-lg">{count} Units</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-slate-400">Loading bank parameters...</p>
                            )}
                          </SectionCard>
                        </div>
                      )}

                      {roleKey === 'admin' && (
                        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
                          <SectionCard title="Latest System Audit Entries" kicker="System Audit" darkMode={isDark}>
                            <div className="grid gap-3">
                              {allUsers.slice(0, 5).map((u) => (
                                <div key={u.email} className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                                  <div>
                                    <h4 className="font-bold">{u.name}</h4>
                                    <p className="text-xs text-slate-400">{u.email}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs uppercase bg-rose-500/20 text-rose-300 font-bold px-3 py-1 rounded-full">{u.role}</span>
                                    <p className="text-[10px] text-slate-500 mt-1">Status: {u.status}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </SectionCard>

                          <SectionCard title="Pending Coordinator Audits" kicker="Review Queue" darkMode={isDark}>
                            <div className="p-4 rounded-xl text-center border border-white/10 bg-white/5">
                              <p className="text-sm text-slate-400">All coordinators active. Systems secure.</p>
                            </div>
                          </SectionCard>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. DONOR PROFILE TAB */}
                  {activeTab === 'donor-profile' && roleKey === 'donor' && (
                    <SectionCard title={donorProfile ? "Modify Donor Parameters" : "Setup Donor Credentials"} kicker="Identity" darkMode={isDark}>
                      <form onSubmit={handleDonorProfileSubmit} className="grid gap-4 max-w-xl">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="flex flex-col gap-1.5">
                            <span className="font-heading text-xs font-semibold uppercase tracking-wider">Blood Type</span>
                            <select
                              value={donorForm.bloodType}
                              onChange={(e) => setDonorForm({ ...donorForm, bloodType: e.target.value })}
                              className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                            >
                              {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((type) => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </label>

                          <label className="flex flex-col gap-1.5">
                            <span className="font-heading text-xs font-semibold uppercase tracking-wider">Contact Number</span>
                            <input
                              type="text"
                              value={donorForm.contactNumber}
                              onChange={(e) => setDonorForm({ ...donorForm, contactNumber: e.target.value })}
                              placeholder="e.g. +919998887776 (Digits only)"
                              required
                              className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                            />
                          </label>
                        </div>

                        <label className="flex flex-col gap-1.5">
                          <span className="font-heading text-xs font-semibold uppercase tracking-wider">Address Line</span>
                          <input
                            type="text"
                            value={donorForm.addressLine}
                            onChange={(e) => setDonorForm({ ...donorForm, addressLine: e.target.value })}
                            placeholder="Street address, colony, block"
                            className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                          />
                        </label>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <label className="flex flex-col gap-1.5">
                            <span className="font-heading text-xs font-semibold uppercase tracking-wider">City</span>
                            <input
                              type="text"
                              value={donorForm.city}
                              onChange={(e) => setDonorForm({ ...donorForm, city: e.target.value })}
                              placeholder="City"
                              required
                              className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                            />
                          </label>

                          <label className="flex flex-col gap-1.5">
                            <span className="font-heading text-xs font-semibold uppercase tracking-wider">State</span>
                            <input
                              type="text"
                              value={donorForm.state}
                              onChange={(e) => setDonorForm({ ...donorForm, state: e.target.value })}
                              placeholder="State"
                              className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                            />
                          </label>

                          <label className="flex flex-col gap-1.5">
                            <span className="font-heading text-xs font-semibold uppercase tracking-wider">Zip Code</span>
                            <input
                              type="text"
                              value={donorForm.zipCode}
                              onChange={(e) => setDonorForm({ ...donorForm, zipCode: e.target.value })}
                              placeholder="Zip Code"
                              required
                              className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                            />
                          </label>
                        </div>

                        <label className="flex flex-col gap-1.5">
                          <span className="font-heading text-xs font-semibold uppercase tracking-wider">Availability Status</span>
                          <select
                            value={donorForm.availability}
                            onChange={(e) => setDonorForm({ ...donorForm, availability: e.target.value })}
                            className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                          >
                            <option value="available">Available Immediately</option>
                            <option value="on_call">On Call (Emergencies)</option>
                            <option value="unavailable">Unavailable (Temporarily Rest)</option>
                          </select>
                        </label>

                        <button
                          type="submit"
                          className="mt-4 py-3 px-6 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-[0_12px_24px_rgba(239,35,60,0.35)]"
                        >
                          {donorProfile ? 'Save Profile Parameters' : 'Create Profile'}
                        </button>
                      </form>
                    </SectionCard>
                  )}

                  {/* 3. DONOR APPOINTMENTS TAB */}
                  {activeTab === 'book-appointment' && roleKey === 'donor' && (
                    <SectionCard
                      title="Your Scheduled Donation Bookings"
                      kicker="Appointments"
                      darkMode={isDark}
                      action={
                        <button
                          type="button"
                          onClick={() => setBookingModalOpen(true)}
                          className="flex items-center gap-2 py-2.5 px-5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm shadow-[0_10px_20px_rgba(239,35,60,0.25)]"
                        >
                          <FiPlus /> New Appointment
                        </button>
                      }
                    >
                      <div className="grid gap-4 mt-4">
                        {appointments.length === 0 ? (
                          <div className={`p-10 text-center rounded-2xl border ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                            No appointments found. Book one using the button above.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                              <thead>
                                <tr className={`border-b text-xs uppercase tracking-wider text-slate-500 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                                  <th className="py-4 px-4">Facility</th>
                                  <th className="py-4 px-4">Date/Time</th>
                                  <th className="py-4 px-4">Status</th>
                                  <th className="py-4 px-4">Notes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {appointments.map((appt) => (
                                  <tr key={appt._id} className={`border-b text-sm ${isDark ? 'border-white/10 hover:bg-white/[0.02]' : 'border-slate-200 hover:bg-slate-50'}`}>
                                    <td className="py-4 px-4 font-bold">{appt.bloodBank?.name || 'Blood Bank'}</td>
                                    <td className="py-4 px-4">{new Date(appt.appointmentDate).toLocaleString()}</td>
                                    <td className="py-4 px-4">
                                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${appt.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : appt.status === 'rejected' || appt.status === 'cancelled' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                        {appt.status}
                                      </span>
                                    </td>
                                    <td className="py-4 px-4 max-w-xs truncate">{appt.notes || '--'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </SectionCard>
                  )}

                  {/* 4. DONOR HISTORY TAB */}
                  {activeTab === 'donation-history' && roleKey === 'donor' && (
                    <SectionCard title="Your Verified Donation Records" kicker="History" darkMode={isDark}>
                      <div className="grid gap-4">
                        {donations.length === 0 ? (
                          <div className={`p-10 text-center rounded-2xl border ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                            No donations logged yet. Donations are logged automatically when you complete an appointment check-in.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                              <thead>
                                <tr className={`border-b text-xs uppercase tracking-wider text-slate-500 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                                  <th className="py-4 px-4">Donation Date</th>
                                  <th className="py-4 px-4">Blood Group</th>
                                  <th className="py-4 px-4">Draw Volume</th>
                                  <th className="py-4 px-4">Draw Site</th>
                                  <th className="py-4 px-4">Verification</th>
                                </tr>
                              </thead>
                              <tbody>
                                {donations.map((don) => (
                                  <tr key={don._id} className={`border-b text-sm ${isDark ? 'border-white/10 hover:bg-white/[0.02]' : 'border-slate-200 hover:bg-slate-50'}`}>
                                    <td className="py-4 px-4">{new Date(don.donationDate).toLocaleDateString()}</td>
                                    <td className="py-4 px-4 font-bold text-rose-500">{don.bloodType}</td>
                                    <td className="py-4 px-4 font-bold">{don.unitsDonated} Unit(s)</td>
                                    <td className="py-4 px-4">{don.bloodBank?.name || 'Facility Center'}</td>
                                    <td className="py-4 px-4">
                                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${don.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                        {don.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </SectionCard>
                  )}

                  {/* 5. RECIPIENT PROFILE TAB */}
                  {activeTab === 'recipient-profile' && roleKey === 'recipient' && (
                    <SectionCard title={recipientProfile ? "Modify Recipient Profile" : "Setup Recipient Credentials"} kicker="Identity" darkMode={isDark}>
                      <form onSubmit={handleRecipientProfileSubmit} className="grid gap-4 max-w-xl">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="flex flex-col gap-1.5">
                            <span className="font-heading text-xs font-semibold uppercase tracking-wider">Default Blood Group</span>
                            <select
                              value={recipientForm.bloodType}
                              onChange={(e) => setRecipientForm({ ...recipientForm, bloodType: e.target.value })}
                              className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                            >
                              {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((type) => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </label>

                          <label className="flex flex-col gap-1.5">
                            <span className="font-heading text-xs font-semibold uppercase tracking-wider">Contact Phone</span>
                            <input
                              type="text"
                              value={recipientForm.contactNumber}
                              onChange={(e) => setRecipientForm({ ...recipientForm, contactNumber: e.target.value })}
                              placeholder="e.g. +918887776665"
                              required
                              className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                            />
                          </label>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="flex flex-col gap-1.5">
                            <span className="font-heading text-xs font-semibold uppercase tracking-wider">Default Hospital Name</span>
                            <input
                              type="text"
                              value={recipientForm.hospitalName}
                              onChange={(e) => setRecipientForm({ ...recipientForm, hospitalName: e.target.value })}
                              placeholder="e.g. SF General Hospital"
                              className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                            />
                          </label>

                          <label className="flex flex-col gap-1.5">
                            <span className="font-heading text-xs font-semibold uppercase tracking-wider">City</span>
                            <input
                              type="text"
                              value={recipientForm.city}
                              onChange={(e) => setRecipientForm({ ...recipientForm, city: e.target.value })}
                              placeholder="City"
                              required
                              className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                            />
                          </label>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <label className="flex flex-col gap-1.5">
                            <span className="font-heading text-xs font-semibold uppercase tracking-wider">Zip Code</span>
                            <input
                              type="text"
                              value={recipientForm.zipCode}
                              onChange={(e) => setRecipientForm({ ...recipientForm, zipCode: e.target.value })}
                              placeholder="Zip Code"
                              required
                              className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                            />
                          </label>

                          <label className="flex flex-col gap-1.5">
                            <span className="font-heading text-xs font-semibold uppercase tracking-wider">Emergency Contact Name</span>
                            <input
                              type="text"
                              value={recipientForm.emergencyContactName}
                              onChange={(e) => setRecipientForm({ ...recipientForm, emergencyContactName: e.target.value })}
                              placeholder="Contact Name"
                              className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                            />
                          </label>

                          <label className="flex flex-col gap-1.5">
                            <span className="font-heading text-xs font-semibold uppercase tracking-wider">Emergency Phone</span>
                            <input
                              type="text"
                              value={recipientForm.emergencyContactPhone}
                              onChange={(e) => setRecipientForm({ ...recipientForm, emergencyContactPhone: e.target.value })}
                              placeholder="Emergency Phone"
                              className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                            />
                          </label>
                        </div>

                        <label className="flex flex-col gap-1.5">
                          <span className="font-heading text-xs font-semibold uppercase tracking-wider">Medical History Notes</span>
                          <textarea
                            value={recipientForm.medicalHistory}
                            onChange={(e) => setRecipientForm({ ...recipientForm, medicalHistory: e.target.value })}
                            rows={3}
                            placeholder="Anemia details, diagnoses, conditions..."
                            className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                          />
                        </label>

                        <button
                          type="submit"
                          className="mt-4 py-3 px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-[0_12px_24px_rgba(6,182,212,0.35)]"
                        >
                          Save Recipient profile
                        </button>
                      </form>
                    </SectionCard>
                  )}

                  {/* 6. RECIPIENT BLOOD REQUESTS TAB */}
                  {activeTab === 'blood-requests' && roleKey === 'recipient' && (
                    <div className="grid gap-6 lg:grid-cols-[1fr,1.3fr]">
                      <SectionCard title="Publish Emergency Blood Request" kicker="Demand Form" darkMode={isDark}>
                        <form onSubmit={handleCreateBloodRequest} className="grid gap-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <label className="flex flex-col gap-1.5">
                              <span className="font-heading text-xs font-semibold uppercase tracking-wider">Recipient Patient Name</span>
                              <input
                                type="text"
                                value={requestForm.recipientName}
                                onChange={(e) => setRequestForm({ ...requestForm, recipientName: e.target.value })}
                                placeholder="Patient Full Name"
                                required
                                className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                              />
                            </label>

                            <label className="flex flex-col gap-1.5">
                              <span className="font-heading text-xs font-semibold uppercase tracking-wider">Blood Type Needed</span>
                              <select
                                value={requestForm.bloodTypeNeeded}
                                onChange={(e) => setRequestForm({ ...requestForm, bloodTypeNeeded: e.target.value })}
                                className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                              >
                                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((type) => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </label>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <label className="flex flex-col gap-1.5">
                              <span className="font-heading text-xs font-semibold uppercase tracking-wider">Draw Units Count (Max 20)</span>
                              <input
                                type="number"
                                min={1}
                                max={20}
                                value={requestForm.unitsNeeded}
                                onChange={(e) => setRequestForm({ ...requestForm, unitsNeeded: Number(e.target.value) })}
                                required
                                className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                              />
                            </label>

                            <label className="flex flex-col gap-1.5">
                              <span className="font-heading text-xs font-semibold uppercase tracking-wider">Hospital Name</span>
                              <input
                                type="text"
                                value={requestForm.hospitalName}
                                onChange={(e) => setRequestForm({ ...requestForm, hospitalName: e.target.value })}
                                placeholder="Hospital name"
                                required
                                className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                              />
                            </label>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-3">
                            <label className="flex flex-col gap-1.5">
                              <span className="font-heading text-xs font-semibold uppercase tracking-wider">City</span>
                              <input
                                type="text"
                                value={requestForm.city}
                                onChange={(e) => setRequestForm({ ...requestForm, city: e.target.value })}
                                placeholder="San Francisco"
                                required
                                className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                              />
                            </label>

                            <label className="flex flex-col gap-1.5">
                              <span className="font-heading text-xs font-semibold uppercase tracking-wider">Contact Phone</span>
                              <input
                                type="text"
                                value={requestForm.contactPhone}
                                onChange={(e) => setRequestForm({ ...requestForm, contactPhone: e.target.value })}
                                placeholder="Ph digits"
                                required
                                className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                              />
                            </label>

                            <label className="flex flex-col gap-1.5">
                              <span className="font-heading text-xs font-semibold uppercase tracking-wider">Urgency</span>
                              <select
                                value={requestForm.urgency}
                                onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                                className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical (Emergency alert)</option>
                              </select>
                            </label>
                          </div>

                          <label className="flex flex-col gap-1.5">
                            <span className="font-heading text-xs font-semibold uppercase tracking-wider">Date Needed By</span>
                            <input
                              type="date"
                              value={requestForm.neededBy}
                              onChange={(e) => setRequestForm({ ...requestForm, neededBy: e.target.value })}
                              required
                              className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                            />
                          </label>

                          <label className="flex flex-col gap-1.5">
                            <span className="font-heading text-xs font-semibold uppercase tracking-wider">Additional Request Details</span>
                            <textarea
                              value={requestForm.notes}
                              onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                              placeholder="Reason for draw, diagnostic instructions..."
                              className={`py-3 px-4 border rounded-xl bg-transparent outline-none focus:border-rose-500 ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800'}`}
                            />
                          </label>

                          <button
                            type="submit"
                            className="mt-2 py-3 px-6 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-[0_10px_20px_rgba(239,35,60,0.35)]"
                          >
                            Publish Blood Request
                          </button>
                        </form>
                      </SectionCard>

                      <SectionCard title="Your Published Requests" kicker="Audit Log" darkMode={isDark}>
                        <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2">
                          {requests.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">No requests submitted. Use the form to submit one.</div>
                          ) : (
                            requests.map((req) => (
                              <div key={req._id} className={`p-4 rounded-xl border flex flex-col gap-3 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                                <div className="flex items-center justify-between">
                                  <span className="font-black text-rose-500">{req.requestCode}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${req.status === 'fulfilled' ? 'bg-emerald-500/20 text-emerald-300' : req.status === 'cancelled' ? 'bg-slate-500/20 text-slate-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                    {req.status}
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <p className="font-semibold">{req.unitsNeeded} unit(s) of {req.bloodTypeNeeded} ({req.urgency} Urgency)</p>
                                  <p className="text-slate-400 mt-1">Hospital: {req.hospitalName}</p>
                                  <p className="text-slate-400">Needed by: {new Date(req.neededBy).toLocaleDateString()}</p>
                                </div>
                                {['pending', 'matched'].includes(req.status) && (
                                  <div className="flex gap-2 mt-2">
                                    <button
                                      type="button"
                                      onClick={() => handleMarkRequestFulfilled(req._id)}
                                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                                    >
                                      Mark Fulfilled
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleCancelRequest(req._id)}
                                      className="py-1.5 px-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg text-xs"
                                    >
                                      Cancel Request
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </SectionCard>
                    </div>
                  )}

                  {/* 7. BLOOD BANK INVENTORY TAB */}
                  {activeTab === 'manage-inventory' && roleKey === 'bank' && (
                    <SectionCard
                      title="Batch Stock Inventory Tracker"
                      kicker="Fulfillment Repository"
                      darkMode={isDark}
                      action={
                        <button
                          type="button"
                          onClick={() => setInventoryModalOpen(true)}
                          className="flex items-center gap-2 py-2.5 px-5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm"
                        >
                          <FiPlus /> Add Inventory Batch
                        </button>
                      }
                    >
                      <div className="grid gap-4 mt-4">
                        {inventory.length === 0 ? (
                          <div className={`p-10 text-center rounded-2xl border ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                            No blood batches currently logged. Log one with the button above.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                              <thead>
                                <tr className={`border-b text-xs uppercase tracking-wider text-slate-500 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                                  <th className="py-4 px-4">Batch Number</th>
                                  <th className="py-4 px-4">Blood Group</th>
                                  <th className="py-4 px-4">Component</th>
                                  <th className="py-4 px-4">Units</th>
                                  <th className="py-4 px-4">Expiry Date</th>
                                  <th className="py-4 px-4">Status</th>
                                  <th className="py-4 px-4">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {inventory.map((item) => (
                                  <tr key={item._id} className={`border-b text-sm ${isDark ? 'border-white/10 hover:bg-white/[0.02]' : 'border-slate-200 hover:bg-slate-50'}`}>
                                    <td className="py-4 px-4 font-black">{item.batchNumber}</td>
                                    <td className="py-4 px-4 font-bold text-rose-500 text-lg">{item.bloodType}</td>
                                    <td className="py-4 px-4 uppercase text-xs text-slate-400 font-bold">{item.component?.replace('_', ' ')}</td>
                                    <td className="py-4 px-4 font-bold">{item.units} Unit(s)</td>
                                    <td className="py-4 px-4">{new Date(item.expiryDate).toLocaleDateString()}</td>
                                    <td className="py-4 px-4">
                                      <select
                                        value={item.status}
                                        onChange={(e) => handleUpdateInventoryStatus(item._id, e.target.value)}
                                        className={`py-1 px-2 border rounded-lg text-xs font-bold bg-slate-900 text-white border-white/10`}
                                      >
                                        <option value="available">Available</option>
                                        <option value="reserved">Reserved</option>
                                        <option value="quarantined">Quarantined</option>
                                        <option value="transfused">Transfused</option>
                                        <option value="discarded">Discarded</option>
                                      </select>
                                    </td>
                                    <td className="py-4 px-4">
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteInventory(item._id)}
                                        className="text-red-500 hover:text-red-400 p-2 rounded-lg"
                                      >
                                        <FiTrash2 />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </SectionCard>
                  )}

                  {/* 8. BLOOD BANK APPOINTMENTS TAB */}
                  {activeTab === 'bank-appointments' && roleKey === 'bank' && (
                    <SectionCard title="Scheduled Donor Appointments" kicker="Fulfillment Intake" darkMode={isDark}>
                      <div className="grid gap-4">
                        {appointments.length === 0 ? (
                          <div className={`p-10 text-center rounded-2xl border ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                            No donor appointments scheduled at this facility.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                              <thead>
                                <tr className={`border-b text-xs uppercase tracking-wider text-slate-500 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                                  <th className="py-4 px-4">Donor Name</th>
                                  <th className="py-4 px-4">Blood Group</th>
                                  <th className="py-4 px-4">Appointment Date</th>
                                  <th className="py-4 px-4">Status</th>
                                  <th className="py-4 px-4">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {appointments.map((appt) => (
                                  <tr key={appt._id} className={`border-b text-sm ${isDark ? 'border-white/10 hover:bg-white/[0.02]' : 'border-slate-200 hover:bg-slate-50'}`}>
                                    <td className="py-4 px-4 font-bold">{appt.donor?.name || 'Donor'}</td>
                                    <td className="py-4 px-4 font-bold text-rose-500">{appt.donorProfile?.bloodType || '--'}</td>
                                    <td className="py-4 px-4">{new Date(appt.appointmentDate).toLocaleString()}</td>
                                    <td className="py-4 px-4">
                                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${appt.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : appt.status === 'rejected' || appt.status === 'cancelled' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                        {appt.status}
                                      </span>
                                    </td>
                                    <td className="py-4 px-4">
                                      <div className="flex gap-2">
                                        {appt.status === 'pending' && (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() => handleApproveAppointment(appt._id)}
                                              className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                                            >
                                              Approve
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => handleRejectAppointment(appt._id)}
                                              className="py-1 px-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold"
                                            >
                                              Decline
                                            </button>
                                          </>
                                        )}
                                        {appt.status === 'approved' && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSelectedAppointment(appt);
                                              setDrawBloodForm((prev) => ({
                                                ...prev,
                                                batchNumber: `DRAW-${appt.donorProfile?.bloodType || 'O'}-${Date.now().toString().slice(-6)}`,
                                                expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 35 days standard
                                              }));
                                              setDrawBloodModalOpen(true);
                                            }}
                                            className="py-1.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                                          >
                                            Check-in & Draw
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </SectionCard>
                  )}

                  {/* 9. BLOOD BANK FULFILL REQUESTS TAB */}
                  {activeTab === 'fulfill-requests' && roleKey === 'bank' && (
                    <SectionCard title="Compatible Open Requests In Your Area" kicker="City Demand" darkMode={isDark}>
                      <div className="grid gap-4">
                        {requests.filter((r) => r.status === 'pending').length === 0 ? (
                          <div className={`p-10 text-center rounded-2xl border ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                            No pending blood requests in your city network.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                              <thead>
                                <tr className={`border-b text-xs uppercase tracking-wider text-slate-500 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                                  <th className="py-4 px-4">Request ID</th>
                                  <th className="py-4 px-4">Patient Name</th>
                                  <th className="py-4 px-4">Blood Group Needed</th>
                                  <th className="py-4 px-4">Hospital Location</th>
                                  <th className="py-4 px-4">Urgency</th>
                                  <th className="py-4 px-4">Needed By</th>
                                  <th className="py-4 px-4">Fulfillment Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {requests
                                  .filter((r) => r.status === 'pending')
                                  .map((req) => (
                                    <tr key={req._id} className={`border-b text-sm ${isDark ? 'border-white/10 hover:bg-white/[0.02]' : 'border-slate-200 hover:bg-slate-50'}`}>
                                      <td className="py-4 px-4 font-black">{req.requestCode}</td>
                                      <td className="py-4 px-4 font-bold">{req.recipientName}</td>
                                      <td className="py-4 px-4 text-rose-500 font-bold text-lg">{req.bloodTypeNeeded}</td>
                                      <td className="py-4 px-4 text-xs">{req.hospitalName}</td>
                                      <td className="py-4 px-4 uppercase text-xs font-bold text-red-400">{req.urgency}</td>
                                      <td className="py-4 px-4">{new Date(req.neededBy).toLocaleDateString()}</td>
                                      <td className="py-4 px-4">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedRequest(req);
                                            setAllocateModalOpen(true);
                                          }}
                                          className="py-1.5 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold"
                                        >
                                          Fulfill Request
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </SectionCard>
                  )}

                  {/* 10. ADMIN APPROVE DONORS TAB */}
                  {activeTab === 'approve-donors' && roleKey === 'admin' && (
                    <SectionCard title="Pending Donor Registration Profiles" kicker="Audit Desk" darkMode={isDark}>
                      <div className="grid gap-4">
                        {allDonors.filter((d) => d.approvalStatus === 'pending').length === 0 ? (
                          <div className={`p-10 text-center rounded-2xl border ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                            No pending donor profile approval requests found.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                              <thead>
                                <tr className={`border-b text-xs uppercase tracking-wider text-slate-500 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                                  <th className="py-4 px-4">Name</th>
                                  <th className="py-4 px-4">Blood Group</th>
                                  <th className="py-4 px-4">Location</th>
                                  <th className="py-4 px-4">Contact Phone</th>
                                  <th className="py-4 px-4">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {allDonors
                                  .filter((d) => d.approvalStatus === 'pending')
                                  .map((donor) => (
                                    <tr key={donor._id} className={`border-b text-sm ${isDark ? 'border-white/10 hover:bg-white/[0.02]' : 'border-slate-200 hover:bg-slate-50'}`}>
                                      <td className="py-4 px-4 font-bold">{donor.user?.name || 'User'}</td>
                                      <td className="py-4 px-4 font-bold text-rose-500">{donor.bloodType}</td>
                                      <td className="py-4 px-4 text-xs">{donor.city}, {donor.state}</td>
                                      <td className="py-4 px-4">{donor.contactNumber}</td>
                                      <td className="py-4 px-4">
                                        <div className="flex gap-2">
                                          <button
                                            type="button"
                                            onClick={() => handleApproveDonorProfile(donor._id)}
                                            className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                                          >
                                            Approve
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleRejectDonorProfile(donor._id)}
                                            className="py-1 px-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold"
                                          >
                                            Reject
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </SectionCard>
                  )}

                  {/* 11. ADMIN BLOOD BANKS TAB */}
                  {activeTab === 'manage-banks' && roleKey === 'admin' && (
                    <SectionCard
                      title="Registered Blood Bank Repositories"
                      kicker="Facilities Index"
                      darkMode={isDark}
                      action={
                        <button
                          type="button"
                          onClick={() => setBankModalOpen(true)}
                          className="flex items-center gap-2 py-2.5 px-5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm"
                        >
                          <FiPlus /> Register Blood Bank
                        </button>
                      }
                    >
                      <div className="grid gap-4 mt-4">
                        {allBanks.length === 0 ? (
                          <div className={`p-10 text-center rounded-2xl border ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                            No blood banks registered. Set one up using the button above.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                              <thead>
                                <tr className={`border-b text-xs uppercase tracking-wider text-slate-500 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                                  <th className="py-4 px-4">Name</th>
                                  <th className="py-4 px-4">License</th>
                                  <th className="py-4 px-4">City</th>
                                  <th className="py-4 px-4">Contact Phone</th>
                                  <th className="py-4 px-4">Manager Email</th>
                                </tr>
                              </thead>
                              <tbody>
                                {allBanks.map((bank) => (
                                  <tr key={bank._id} className={`border-b text-sm ${isDark ? 'border-white/10 hover:bg-white/[0.02]' : 'border-slate-200 hover:bg-slate-50'}`}>
                                    <td className="py-4 px-4 font-bold">{bank.name}</td>
                                    <td className="py-4 px-4 font-black">{bank.licenseNumber || 'N/A'}</td>
                                    <td className="py-4 px-4">{bank.city}</td>
                                    <td className="py-4 px-4 font-bold text-rose-500">{bank.contactNumber}</td>
                                    <td className="py-4 px-4 text-xs text-slate-400">{bank.user?.email || 'N/A'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </SectionCard>
                  )}

                  {/* 12. ADMIN USER AUDIT TAB */}
                  {activeTab === 'audit-users' && roleKey === 'admin' && (
                    <SectionCard title="Secure Registry User Directory" kicker="System Accounts" darkMode={isDark}>
                      <div className="grid gap-4">
                        {allUsers.length === 0 ? (
                          <div className={`p-10 text-center rounded-2xl border ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                            No users registered in directory audit trail.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                              <thead>
                                <tr className={`border-b text-xs uppercase tracking-wider text-slate-500 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                                  <th className="py-4 px-4">Name</th>
                                  <th className="py-4 px-4">Email</th>
                                  <th className="py-4 px-4">Role</th>
                                  <th className="py-4 px-4">Status</th>
                                  <th className="py-4 px-4">Created Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {allUsers.map((u) => (
                                  <tr key={u.email} className={`border-b text-sm ${isDark ? 'border-white/10 hover:bg-white/[0.02]' : 'border-slate-200 hover:bg-slate-50'}`}>
                                    <td className="py-4 px-4 font-bold">{u.name}</td>
                                    <td className="py-4 px-4 font-semibold text-slate-400">{u.email}</td>
                                    <td className="py-4 px-4">
                                      <span className="bg-rose-500/20 text-rose-300 text-xs font-bold tracking-wider px-2 py-0.5 rounded-full">
                                        {u.role}
                                      </span>
                                    </td>
                                    <td className="py-4 px-4 text-xs font-bold uppercase">{u.status}</td>
                                    <td className="py-4 px-4 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </SectionCard>
                  )}

                  {/* 13. NOTIFICATIONS TAB */}
                  {activeTab === 'notifications' && (
                    <SectionCard title="Notification Center" kicker="Inbox" darkMode={isDark}>
                      <NotificationList items={notifications.map((n) => ({
                        title: n.title || 'Broadcast Alert',
                        detail: n.message,
                        priority: n.type === 'alert' ? 'high' : n.type === 'request' ? 'medium' : 'normal'
                      }))} darkMode={isDark} />
                    </SectionCard>
                  )}

                  {/* 14. SETTINGS TAB */}
                  {activeTab === 'settings' && (
                    <SectionCard title="Workspace Settings" kicker="Preferences" darkMode={isDark}>
                      <div className="grid gap-4">
                        <div className={`flex flex-col gap-4 rounded-[1.5rem] border p-5 md:flex-row md:items-center md:justify-between ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-slate-50/70'}`}>
                          <div>
                            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Dark mode</h3>
                            <p className={`mt-1 text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Keep the command surface low-glare for long sessions.</p>
                          </div>
                          <button
                            type="button"
                            onClick={toggleTheme}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${isDark ? 'border-white/10 bg-white/[0.08] text-white' : 'border-slate-200 bg-white text-slate-700'}`}
                          >
                            {isDark ? <FiMoon /> : <FiSun />}
                            {isDark ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                      </div>
                    </SectionCard>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODALS AND PORTALS ================= */}

      {/* 1. BOOK APPOINTMENT MODAL (DONOR) */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md px-4">
          <div className={`glass-card border rounded-[2rem] p-6 max-w-lg w-full shadow-premium relative ${isDark ? 'border-white/10 text-white bg-slate-950' : 'border-slate-200 text-slate-800 bg-white'}`}>
            <button
              type="button"
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl border border-white/10 hover:bg-white/5"
            >
              <FiX />
            </button>
            <h3 className="font-heading text-xl font-bold mb-4">Request Donation Appointment</h3>
            <form onSubmit={handleBookAppointment} className="grid gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Select Blood Bank</span>
                <select
                  value={appointmentForm.bloodBank}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, bloodBank: e.target.value })}
                  required
                  className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'}`}
                >
                  <option value="">-- Choose Facility --</option>
                  {allBanks.map((bank) => (
                    <option key={bank._id} value={bank._id}>{bank.name} ({bank.city})</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Appointment Date & Time</span>
                <input
                  type="datetime-local"
                  value={appointmentForm.appointmentDate}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, appointmentDate: e.target.value })}
                  required
                  className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'}`}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Donor Notes</span>
                <textarea
                  value={appointmentForm.notes}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                  placeholder="Preferences, queries..."
                  className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'}`}
                />
              </label>

              <button
                type="submit"
                className="py-3 px-6 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-[0_8px_16px_rgba(239,35,60,0.3)] mt-2"
              >
                Submit Booking Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. ADD INVENTORY BATCH MODAL (BLOOD BANK) */}
      {inventoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md px-4">
          <div className={`glass-card border rounded-[2rem] p-6 max-w-lg w-full shadow-premium relative ${isDark ? 'border-white/10 text-white bg-slate-950' : 'border-slate-200 text-slate-800 bg-white'}`}>
            <button
              type="button"
              onClick={() => setInventoryModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl border border-white/10 hover:bg-white/5"
            >
              <FiX />
            </button>
            <h3 className="font-heading text-xl font-bold mb-4">Add Blood Batch to Inventory</h3>
            <form onSubmit={handleAddInventory} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Blood Type</span>
                  <select
                    value={inventoryForm.bloodType}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, bloodType: e.target.value })}
                    required
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'}`}
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Component</span>
                  <select
                    value={inventoryForm.component}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, component: e.target.value })}
                    required
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'}`}
                  >
                    <option value="whole_blood">Whole Blood</option>
                    <option value="packed_rbc">Packed RBC</option>
                    <option value="plasma">Plasma</option>
                    <option value="platelets">Platelets</option>
                    <option value="cryoprecipitate">Cryoprecipitate</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Volume Pint Units</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={inventoryForm.units}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, units: Number(e.target.value) })}
                    required
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'}`}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Batch Identifier</span>
                  <input
                    type="text"
                    value={inventoryForm.batchNumber}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, batchNumber: e.target.value })}
                    placeholder="e.g. BATCH-A-POS-505"
                    required
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'}`}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Expiry Date</span>
                  <input
                    type="date"
                    value={inventoryForm.expiryDate}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, expiryDate: e.target.value })}
                    required
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'}`}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Storage Rack Location</span>
                  <input
                    type="text"
                    value={inventoryForm.storageLocation}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, storageLocation: e.target.value })}
                    placeholder="e.g. Fridge-Shelf-B4"
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'}`}
                  />
                </label>
              </div>

              <button
                type="submit"
                className="py-3 px-6 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-[0_8px_16px_rgba(245,158,11,0.3)] mt-2"
              >
                Log Batch Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. DRAW BLOOD & CHECK-IN MODAL (BLOOD BANK) */}
      {drawBloodModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md px-4">
          <div className={`glass-card border rounded-[2rem] p-6 max-w-lg w-full shadow-premium relative ${isDark ? 'border-white/10 text-white bg-slate-950' : 'border-slate-200 text-slate-800 bg-white'}`}>
            <button
              type="button"
              onClick={() => setDrawBloodModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl border border-white/10 hover:bg-white/5"
            >
              <FiX />
            </button>
            <h3 className="font-heading text-xl font-bold mb-2">Check-in & Draw Blood</h3>
            <p className="text-xs text-slate-400 mb-4">
              Donor: <strong className="text-white">{selectedAppointment.donor?.name}</strong> ({selectedAppointment.donorProfile?.bloodType})
            </p>
            <form onSubmit={handleDrawBloodSubmit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Select Draw Component</span>
                  <select
                    value={drawBloodForm.component}
                    onChange={(e) => setDrawBloodForm({ ...drawBloodForm, component: e.target.value })}
                    required
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'}`}
                  >
                    <option value="whole_blood">Whole Blood</option>
                    <option value="packed_rbc">Packed RBC</option>
                    <option value="plasma">Plasma</option>
                    <option value="platelets">Platelets</option>
                    <option value="cryoprecipitate">Cryoprecipitate</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Units Count</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={drawBloodForm.units}
                    onChange={(e) => setDrawBloodForm({ ...drawBloodForm, units: Number(e.target.value) })}
                    required
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'}`}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Generated Batch ID</span>
                  <input
                    type="text"
                    value={drawBloodForm.batchNumber}
                    onChange={(e) => setDrawBloodForm({ ...drawBloodForm, batchNumber: e.target.value })}
                    required
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'}`}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Expiry Date</span>
                  <input
                    type="date"
                    value={drawBloodForm.expiryDate}
                    onChange={(e) => setDrawBloodForm({ ...drawBloodForm, expiryDate: e.target.value })}
                    required
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'}`}
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Fridge Shelf Location</span>
                <input
                  type="text"
                  value={drawBloodForm.storageLocation}
                  onChange={(e) => setDrawBloodForm({ ...drawBloodForm, storageLocation: e.target.value })}
                  required
                  className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'}`}
                />
              </label>

              <button
                type="submit"
                className="py-3 px-6 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-[0_8px_16px_rgba(239,35,60,0.3)] mt-2"
              >
                Perform Intake & Verification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. ALLOCATE AND FULFILL MODAL (BLOOD BANK) */}
      {allocateModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md px-4">
          <div className={`glass-card border rounded-[2rem] p-6 max-w-lg w-full shadow-premium relative ${isDark ? 'border-white/10 text-white bg-slate-950' : 'border-slate-200 text-slate-800 bg-white'}`}>
            <button
              type="button"
              onClick={() => setAllocateModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl border border-white/10 hover:bg-white/5"
            >
              <FiX />
            </button>
            <h3 className="font-heading text-xl font-bold mb-2">Allocate Inventory Units</h3>
            <p className="text-xs text-slate-400 mb-4">
              Fulfilling Request <strong className="text-white">{selectedRequest.requestCode}</strong> for <strong className="text-white">{selectedRequest.unitsNeeded} units</strong> of <strong className="text-rose-500">{selectedRequest.bloodTypeNeeded}</strong>.
            </p>
            <div className="grid gap-3 max-h-80 overflow-y-auto mt-2">
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Select Available Stock Batch:</span>
              {inventory.filter((i) => i.status === 'available' && i.bloodType === selectedRequest.bloodTypeNeeded).length === 0 ? (
                <div className="p-4 text-center text-slate-400 border border-dashed border-white/10 rounded-xl">
                  No matching O+ blood type batches are available in your database. Log batches first.
                </div>
              ) : (
                inventory
                  .filter((i) => i.status === 'available' && i.bloodType === selectedRequest.bloodTypeNeeded)
                  .map((item) => (
                    <div key={item._id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                      <div>
                        <h4 className="font-black text-sm">{item.batchNumber} ({item.component})</h4>
                        <p className="text-xs text-slate-400 mt-1">Available Units: {item.units} | Expiry: {new Date(item.expiryDate).toLocaleDateString()}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFulfillRequestWithBatch(selectedRequest._id, item._id)}
                        className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                      >
                        Allocate Batch
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. REGISTER BLOOD BANK MODAL (ADMIN) */}
      {bankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md px-4">
          <div className={`glass-card border rounded-[2rem] p-6 max-w-lg w-full shadow-premium relative ${isDark ? 'border-white/10 text-white bg-slate-950' : 'border-slate-200 text-slate-800 bg-white'}`}>
            <button
              type="button"
              onClick={() => setBankModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl border border-white/10 hover:bg-white/5"
            >
              <FiX />
            </button>
            <h3 className="font-heading text-xl font-bold mb-4">Register New Blood Bank</h3>
            <form onSubmit={handleCreateBloodBank} className="grid gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Blood Bank Name</span>
                <input
                  type="text"
                  value={newBankForm.name}
                  onChange={(e) => setNewBankForm({ ...newBankForm, name: e.target.value })}
                  placeholder="e.g. SF Central Blood Bank"
                  required
                  className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800 bg-white'}`}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Street Address</span>
                <input
                  type="text"
                  value={newBankForm.address}
                  onChange={(e) => setNewBankForm({ ...newBankForm, address: e.target.value })}
                  placeholder="123 Folsom Street"
                  required
                  className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800 bg-white'}`}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">City</span>
                  <input
                    type="text"
                    value={newBankForm.city}
                    onChange={(e) => setNewBankForm({ ...newBankForm, city: e.target.value })}
                    placeholder="San Francisco"
                    required
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800 bg-white'}`}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">State</span>
                  <input
                    type="text"
                    value={newBankForm.state}
                    onChange={(e) => setNewBankForm({ ...newBankForm, state: e.target.value })}
                    placeholder="CA"
                    required
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800 bg-white'}`}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Zip Code</span>
                  <input
                    type="text"
                    value={newBankForm.zipCode}
                    onChange={(e) => setNewBankForm({ ...newBankForm, zipCode: e.target.value })}
                    placeholder="94103"
                    required
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800 bg-white'}`}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Contact Number</span>
                  <input
                    type="text"
                    value={newBankForm.contactNumber}
                    onChange={(e) => setNewBankForm({ ...newBankForm, contactNumber: e.target.value })}
                    placeholder="e.g. +14155550144"
                    required
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800 bg-white'}`}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">License ID</span>
                  <input
                    type="text"
                    value={newBankForm.licenseNumber}
                    onChange={(e) => setNewBankForm({ ...newBankForm, licenseNumber: e.target.value })}
                    placeholder="LIC-123456"
                    required
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800 bg-white'}`}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Bank Email</span>
                  <input
                    type="email"
                    value={newBankForm.email}
                    onChange={(e) => setNewBankForm({ ...newBankForm, email: e.target.value })}
                    placeholder="email@example.com"
                    required
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 text-white bg-slate-900' : 'border-slate-200 text-slate-800 bg-white'}`}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Assign Manager Account</span>
                  <select
                    value={newBankForm.user}
                    onChange={(e) => setNewBankForm({ ...newBankForm, user: e.target.value })}
                    required
                    className={`py-3 px-4 border rounded-xl bg-transparent outline-none ${isDark ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'}`}
                  >
                    <option value="">-- Choose Account --</option>
                    {allUsers.filter((u) => u.role === 'bank').map((u) => (
                      <option key={u.email} value={u._id || u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                type="submit"
                className="py-3 px-6 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-[0_8px_16px_rgba(239,35,60,0.3)] mt-2"
              >
                Create Blood Bank Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
