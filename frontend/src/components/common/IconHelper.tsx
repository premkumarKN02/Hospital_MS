import React from 'react';
import {
  Stethoscope,
  Activity,
  HeartPulse,
  ShieldCheck,
  Wind,
  Utensils,
  Users,
  UserCheck,
  Smile,
  Sparkles,
  FileText,
  CheckCircle2,
  Building2,
  HeartHandshake,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Award,
  AlertCircle,
  HelpCircle,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Stethoscope,
  Activity,
  HeartPulse,
  ShieldCheck,
  Wind,
  Utensils,
  Users,
  UserCheck,
  Smile,
  Sparkles,
  FileText,
  CheckCircle2,
  Building2,
  HeartHandshake,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Award,
  AlertCircle,
  HelpCircle
};

interface IconHelperProps {
  name: string;
  className?: string;
}

export const IconHelper: React.FC<IconHelperProps> = ({ name, className = 'w-5 h-5' }) => {
  const IconComponent = iconMap[name] || Stethoscope;
  return <IconComponent className={className} />;
};
