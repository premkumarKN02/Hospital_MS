export interface HospitalBranch {
  id: string;
  code: string;
  name: string;
  country: string;
  flag: string;
  city: string;
  emergencyPhone: string;
  timezone: string;
  currencyCode: string;
}

export const HOSPITAL_BRANCHES: HospitalBranch[] = [
  {
    id: '11111111-0001-0000-0000-000000000001',
    code: 'CHN-MAIN',
    name: 'Chennai Tertiary Medical City',
    country: 'India',
    flag: '🇮🇳',
    city: 'Chennai',
    emergencyPhone: '+91 44 2829 0000',
    timezone: 'Asia/Kolkata (IST)',
    currencyCode: 'INR',
  },
  {
    id: '11111111-0002-0000-0000-000000000002',
    code: 'DXB-SPEC',
    name: 'Dubai Healthcare Specialty Hospital',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    city: 'Dubai Healthcare City',
    emergencyPhone: '+971 4 383 8000',
    timezone: 'Asia/Dubai (GST)',
    currencyCode: 'AED',
  },
  {
    id: '11111111-0003-0000-0000-000000000003',
    code: 'LON-CENT',
    name: 'London Harley Street Clinic',
    country: 'United Kingdom',
    flag: '🇬🇧',
    city: 'London W1',
    emergencyPhone: '+44 20 7908 2000',
    timezone: 'Europe/London (BST)',
    currencyCode: 'GBP',
  },
  {
    id: '11111111-0004-0000-0000-000000000004',
    code: 'SGP-HUB',
    name: 'Singapore Central Health Hub',
    country: 'Singapore',
    flag: '🇸🇬',
    city: 'Novena Medical Center',
    emergencyPhone: '+65 6789 1000',
    timezone: 'Asia/Singapore (SGT)',
    currencyCode: 'USD',
  },
  {
    id: '11111111-0005-0000-0000-000000000005',
    code: 'NYC-PRES',
    name: 'New York Manhattan Medical Pavilion',
    country: 'United States',
    flag: '🇺🇸',
    city: 'New York, NY',
    emergencyPhone: '+1 212 746 5000',
    timezone: 'America/New_York (EST)',
    currencyCode: 'USD',
  },
  {
    id: '11111111-0006-0000-0000-000000000006',
    code: 'SYD-PREC',
    name: 'Sydney Central Health & Trauma Campus',
    country: 'Australia',
    flag: '🇦🇺',
    city: 'Sydney, NSW',
    emergencyPhone: '+61 2 9382 0000',
    timezone: 'Australia/Sydney (AEST)',
    currencyCode: 'AUD',
  },
  {
    id: '11111111-0007-0000-0000-000000000007',
    code: 'BER-CHAR',
    name: 'Berlin Charité European Care Hub',
    country: 'Germany',
    flag: '🇩🇪',
    city: 'Berlin Mitte',
    emergencyPhone: '+49 30 450 5000',
    timezone: 'Europe/Berlin (CET)',
    currencyCode: 'EUR',
  },
];

const BRANCH_KEY = 'hospital_platform_active_branch';

export function getActiveBranch(): HospitalBranch {
  const saved = localStorage.getItem(BRANCH_KEY);
  if (saved) {
    const found = HOSPITAL_BRANCHES.find((b) => b.code === saved);
    if (found) return found;
  }
  return HOSPITAL_BRANCHES[0];
}

export function setActiveBranch(code: string): HospitalBranch {
  const found = HOSPITAL_BRANCHES.find((b) => b.code === code) || HOSPITAL_BRANCHES[0];
  localStorage.setItem(BRANCH_KEY, found.code);
  window.dispatchEvent(new CustomEvent('branchChange', { detail: found }));
  return found;
}
