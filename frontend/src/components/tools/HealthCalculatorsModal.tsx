import React, { useState } from 'react';
import {
  X,
  Scale,
  Activity,
  HeartPulse,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Info,
  ChevronRight
} from 'lucide-react';
import { PageRoute } from '../../types';

interface HealthCalculatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageRoute) => void;
  lang?: 'en' | 'ta';
}

type CalculatorTab = 'bmi' | 'diabetes' | 'bp' | 'water';

export const HealthCalculatorsModal: React.FC<HealthCalculatorsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  lang = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('bmi');

  // --- 1. Asian-Indian BMI Calculator State ---
  const [heightCm, setHeightCm] = useState('168');
  const [weightKg, setWeightKg] = useState('68');
  const [bmiResult, setBmiResult] = useState<{
    bmi: number;
    category: string;
    idealWeightRange: string;
    color: string;
    advice: string;
  } | null>(null);

  const calculateBmi = () => {
    const h = parseFloat(heightCm) / 100;
    const w = parseFloat(weightKg);
    if (!h || !w || h <= 0 || w <= 0) return;

    const bmi = parseFloat((w / (h * h)).toFixed(1));
    // Asian-Indian WHO Consensus Guidelines:
    // < 18.5 Underweight
    // 18.5 - 22.9 Normal Weight
    // 23.0 - 24.9 Overweight
    // >= 25.0 Obese
    let category = 'Normal Weight';
    let color = 'text-emerald-400';
    let advice = 'Great! Your BMI is in the healthy zone for South Asian adults. Maintain a balanced diet and regular physical activity.';

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-amber-400';
      advice = 'Your weight is below the recommended range. A medical dietary review is advised to check for nutritional deficiencies.';
    } else if (bmi >= 23.0 && bmi < 25.0) {
      category = 'Overweight (Asian-Indian Cutoff)';
      color = 'text-amber-400';
      advice = 'South Asian adults have higher visceral fat risk at BMI ≥ 23. Consider screening for fasting blood sugar and cholesterol.';
    } else if (bmi >= 25.0) {
      category = 'Obesity Grade (Asian-Indian Cutoff)';
      color = 'text-rose-400';
      advice = 'BMI ≥ 25 increases susceptibility to hypertension, diabetes, and fatty liver. We recommend a comprehensive doctor consultation.';
    }

    const minIdeal = (18.5 * h * h).toFixed(1);
    const maxIdeal = (22.9 * h * h).toFixed(1);

    setBmiResult({
      bmi,
      category,
      idealWeightRange: `${minIdeal} kg – ${maxIdeal} kg`,
      color,
      advice
    });
  };

  // --- 2. Indian Diabetes Risk Score (IDRS / MDRF) State ---
  // Age: <35 (0), 35-49 (20), >=50 (30)
  // Waist: M <85/F <80 (0), M 85-89/F 80-89 (10), M >=90/F >=90 (20)
  // Physical Activity: Vigorous/Daily exercise (0), Moderate (20), Sedentary/None (30)
  // Family History: Neither parent (0), One parent (10), Both parents (20)
  const [idrsAge, setIdrsAge] = useState<number>(20); // 35-49 default
  const [idrsWaist, setIdrsWaist] = useState<number>(10);
  const [idrsActivity, setIdrsActivity] = useState<number>(20);
  const [idrsFamily, setIdrsFamily] = useState<number>(10);
  const [idrsScore, setIdrsScore] = useState<number | null>(null);

  const calculateIdrs = () => {
    const total = idrsAge + idrsWaist + idrsActivity + idrsFamily;
    setIdrsScore(total);
  };

  // --- 3. Blood Pressure Category Checker State ---
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [bpResult, setBpResult] = useState<{
    category: string;
    badgeColor: string;
    guidance: string;
    isUrgent: boolean;
  } | null>(null);

  const checkBp = () => {
    const sys = parseInt(systolic, 10);
    const dia = parseInt(diastolic, 10);
    if (!sys || !dia) return;

    if (sys >= 180 || dia >= 120) {
      setBpResult({
        category: 'Hypertensive Crisis (Extremely High)',
        badgeColor: 'bg-rose-950 text-rose-300 border-rose-500',
        guidance: 'CRITICAL ALERT: Seek immediate emergency medical care (dial 108/112 or visit emergency room) if accompanied by chest pain, headache, or breathlessness.',
        isUrgent: true
      });
    } else if (sys >= 140 || dia >= 90) {
      setBpResult({
        category: 'Stage 2 Hypertension',
        badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
        guidance: 'Consistently high readings require clinical evaluation, medication optimization, and lifestyle modification with your doctor.',
        isUrgent: false
      });
    } else if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
      setBpResult({
        category: 'Stage 1 Hypertension',
        badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
        guidance: 'Mildly elevated pressure. Physician review and reduced sodium intake are recommended before it advances.',
        isUrgent: false
      });
    } else if (sys >= 120 && sys <= 129 && dia < 80) {
      setBpResult({
        category: 'Elevated Blood Pressure',
        badgeColor: 'bg-yellow-950/80 text-yellow-300 border-yellow-500/40',
        guidance: 'Systolic pressure is slightly above ideal. Lifestyle measures (brisk walking, lower salt) can restore normal levels.',
        isUrgent: false
      });
    } else {
      setBpResult({
        category: 'Normal Healthy Blood Pressure',
        badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
        guidance: 'Optimal range (<120/<80 mmHg). Continue your healthy cardiovascular habits and routine annual checks.',
        isUrgent: false
      });
    }
  };

  // --- 4. Daily Hydration Requirement State ---
  const [waterWeight, setWaterWeight] = useState('65');
  const [climateActivity, setClimateActivity] = useState<'normal' | 'warm_active'>('warm_active');
  const [waterResult, setWaterResult] = useState<string | null>(null);

  const calculateWater = () => {
    const w = parseFloat(waterWeight);
    if (!w || w <= 0) return;
    // Base formula: 35ml per kg. If warm climate or active: 40-45ml per kg.
    const multiplier = climateActivity === 'warm_active' ? 0.042 : 0.035;
    const liters = (w * multiplier).toFixed(1);
    setWaterResult(`${liters} Liters / day (~${Math.round(parseFloat(liters) * 4)} glasses)`);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-slate-900 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950/60 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-950/85 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-md">
              <Activity className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {lang === 'ta' ? 'மருத்துவ நலக் கணக்கீடுகள்' : 'Clinical Health Calculators'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {lang === 'ta'
                  ? 'இந்திய தரநிலைகளுக்கான துல்லியமான மருத்துவ அளவீடுகள்'
                  : 'Calibrated to Asian-Indian consensus guidelines & clinical protocols'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-4 bg-slate-950/80 border-b border-white/10 p-1.5 gap-1 text-xs font-bold text-center">
          <button
            onClick={() => setActiveTab('bmi')}
            className={`py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bmi'
                ? 'bg-slate-800 text-teal-300 shadow-md border border-teal-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span className="hidden sm:inline">BMI (Indian)</span>
            <span className="sm:hidden">BMI</span>
          </button>
          <button
            onClick={() => setActiveTab('diabetes')}
            className={`py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'diabetes'
                ? 'bg-slate-800 text-teal-300 shadow-md border border-teal-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span className="hidden sm:inline">Diabetes Risk (IDRS)</span>
            <span className="sm:hidden">Diabetes</span>
          </button>
          <button
            onClick={() => setActiveTab('bp')}
            className={`py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bp'
                ? 'bg-slate-800 text-teal-300 shadow-md border border-teal-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Blood Pressure</span>
            <span className="sm:hidden">BP Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('water')}
            className={`py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'water'
                ? 'bg-slate-800 text-teal-300 shadow-md border border-teal-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span className="hidden sm:inline">Hydration</span>
            <span className="sm:hidden">Water</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* TAB 1: BMI CALCULATOR */}
          {activeTab === 'bmi' && (
            <div className="space-y-6">
              <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/20 text-xs text-teal-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-teal-300 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Clinical Note:</strong> For South Asian adults, WHO and the Indian Health Ministry set the overweight threshold at <strong>BMI ≥ 23</strong> (instead of 25) due to higher abdominal adiposity and diabetes risk.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="e.g. 170"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-teal-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="e.g. 70"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-teal-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={calculateBmi}
                className="btn-teal w-full py-3 text-sm font-bold shadow-lg"
              >
                Calculate Asian-Indian BMI
              </button>

              {bmiResult && (
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-white/15 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Your Calculated BMI</span>
                      <p className="text-3xl font-black text-white font-mono">{bmiResult.bmi}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Classification</span>
                      <p className={`text-base font-extrabold ${bmiResult.color}`}>{bmiResult.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 py-1">
                    <span>Healthy Indian Weight Range for Your Height:</span>
                    <span className="font-bold text-teal-300 font-mono">{bmiResult.idealWeightRange}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-white/5">
                    {bmiResult.advice}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        onClose();
                        onNavigate('appointments');
                      }}
                      className="text-xs font-bold text-teal-300 hover:text-white flex items-center gap-1.5"
                    >
                      <span>Book Lifestyle Consultation with Doctor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DIABETES RISK SCORE (IDRS) */}
          {activeTab === 'diabetes' && (
            <div className="space-y-6">
              <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/20 text-xs text-teal-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-teal-300 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Indian Diabetes Risk Score (IDRS):</strong> Developed by the Madras Diabetes Research Foundation (MDRF), this validated clinical tool assesses diabetes likelihood based on four simple parameters.
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* 1. Age */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">1. Patient Age</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: '< 35 years (0 pts)', val: 0 },
                      { label: '35 – 49 years (20 pts)', val: 20 },
                      { label: '≥ 50 years (30 pts)', val: 30 }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setIdrsAge(opt.val)}
                        className={`p-2.5 rounded-xl border font-semibold text-center transition-all ${
                          idrsAge === opt.val
                            ? 'bg-teal-950 border-teal-400 text-teal-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Waist Circumference */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">
                    2. Abdominal Waist Circumference
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Men <85cm / Women <80cm (0 pts)', val: 0 },
                      { label: 'Men 85-89cm / Women 80-89cm (10 pts)', val: 10 },
                      { label: 'Men ≥90cm / Women ≥90cm (20 pts)', val: 20 }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setIdrsWaist(opt.val)}
                        className={`p-2.5 rounded-xl border font-semibold text-center transition-all ${
                          idrsWaist === opt.val
                            ? 'bg-teal-950 border-teal-400 text-teal-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Physical Activity */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">
                    3. Regular Physical Activity / Exercise
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Vigorous / Daily exercise (0 pts)', val: 0 },
                      { label: 'Moderate activity (20 pts)', val: 20 },
                      { label: 'Sedentary / No regular exercise (30 pts)', val: 30 }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setIdrsActivity(opt.val)}
                        className={`p-2.5 rounded-xl border font-semibold text-center transition-all ${
                          idrsActivity === opt.val
                            ? 'bg-teal-950 border-teal-400 text-teal-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Family History */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">
                    4. Family History of Diabetes (Parents)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Neither parent diabetic (0 pts)', val: 0 },
                      { label: 'One parent diabetic (10 pts)', val: 10 },
                      { label: 'Both parents diabetic (20 pts)', val: 20 }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setIdrsFamily(opt.val)}
                        className={`p-2.5 rounded-xl border font-semibold text-center transition-all ${
                          idrsFamily === opt.val
                            ? 'bg-teal-950 border-teal-400 text-teal-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={calculateIdrs}
                className="btn-teal w-full py-3 text-sm font-bold shadow-lg"
              >
                Calculate Indian Diabetes Risk Score
              </button>

              {idrsScore !== null && (
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-white/15 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total IDRS Score</span>
                      <p className="text-3xl font-black text-white font-mono">{idrsScore} / 100</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Risk Stratification</span>
                      <p className={`text-base font-extrabold ${
                        idrsScore >= 60 ? 'text-rose-400' : idrsScore >= 30 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {idrsScore >= 60 ? 'HIGH RISK (≥ 60)' : idrsScore >= 30 ? 'MODERATE RISK (30-50)' : 'LOW RISK (< 30)'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-white/5">
                    {idrsScore >= 60
                      ? 'Score ≥ 60 carries a high likelihood of impaired glucose tolerance or undiagnosed diabetes. A Fasting Blood Sugar (FBS) & HbA1c test with our physician is strongly advised.'
                      : idrsScore >= 30
                      ? 'Moderate risk score. Regular annual blood glucose checks and daily brisk walking (30 mins) are advised to keep glucose levels stable.'
                      : 'Low risk. Continue maintaining an active physical routine, balanced nutrition, and healthy body weight.'}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        onClose();
                        onNavigate('wellness');
                      }}
                      className="text-xs font-bold text-teal-300 hover:text-white flex items-center gap-1.5"
                    >
                      <span>Explore Diabetic Wellness Screening Package</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BLOOD PRESSURE CATEGORY CHECKER */}
          {activeTab === 'bp' && (
            <div className="space-y-6">
              <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/20 text-xs text-teal-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-teal-300 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>AHA & Indian Hypertension Guidelines:</strong> Enter your resting blood pressure in mmHg to see the clinical classification and action guidance.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Systolic (Upper Number - mmHg)
                  </label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    placeholder="e.g. 120"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-teal-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Diastolic (Lower Number - mmHg)
                  </label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    placeholder="e.g. 80"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-teal-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={checkBp}
                className="btn-teal w-full py-3 text-sm font-bold shadow-lg"
              >
                Check Blood Pressure Classification
              </button>

              {bpResult && (
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-white/15 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Reading</span>
                      <p className="text-3xl font-black text-white font-mono">{systolic} / {diastolic} mmHg</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${bpResult.badgeColor}`}>
                      {bpResult.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-white/5">
                    {bpResult.guidance}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        onClose();
                        onNavigate('treatments');
                      }}
                      className="text-xs font-bold text-teal-300 hover:text-white flex items-center gap-1.5"
                    >
                      <span>View Hypertension Clinical Protocol</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DAILY WATER HYDRATION CALCULATOR */}
          {activeTab === 'water' && (
            <div className="space-y-6">
              <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/20 text-xs text-teal-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-teal-300 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Hydration in Tropical Climates:</strong> In warm climates such as Tamil Nadu, adequate fluid intake prevents urinary tract infections (UTIs), kidney stones, and heat exhaustion.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Body Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={waterWeight}
                    onChange={(e) => setWaterWeight(e.target.value)}
                    placeholder="e.g. 65"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-teal-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Climate & Activity Level
                  </label>
                  <select
                    value={climateActivity}
                    onChange={(e) => setClimateActivity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-400 focus:outline-none"
                  >
                    <option value="warm_active">Tropical Climate / Outdoors / Active (Trichy)</option>
                    <option value="normal">Air-conditioned / Sedentary Indoors</option>
                  </select>
                </div>
              </div>

              <button
                onClick={calculateWater}
                className="btn-teal w-full py-3 text-sm font-bold shadow-lg"
              >
                Calculate Recommended Water Intake
              </button>

              {waterResult && (
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-white/15 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Recommended Daily Fluids</span>
                      <p className="text-2xl sm:text-3xl font-black text-teal-300 font-mono">{waterResult}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-teal-500/30 flex items-center justify-center text-teal-300">
                      <Droplets className="w-6 h-6" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-white/5">
                    Tip: Space your fluid intake throughout the day. If you have prescribed cardiac or kidney fluid restrictions, always follow your physician's exact allowance.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Disclaimer */}
        <div className="p-4 bg-slate-950 border-t border-white/10 text-center text-[11px] text-slate-400">
          These tools provide educational health estimations and do not replace personalized in-person clinical assessment by a registered physician.
        </div>
      </div>
    </div>
  );
};
