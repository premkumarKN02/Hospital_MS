# Sindhu Healthcare — Integrated Hospital Management System (HMS / ERP / Telemetry)

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

An enterprise-grade, multi-tenant clinical hospital operating system and medical ERP with integrated real-time emergency doctor geolocation radar, outpatient EHR, inpatient ward bed matrix, automated pharmacy billing, patient self-service portal, and multi-channel WhatsApp/SMTP notification dispatch.

---

## 🌟 Core Modules & Capabilities

### 1. 🚑 Real-Time On-Call Doctor Geolocation Radar
- **Live Satellite Telemetry**: Integrated OpenStreetMap and Esri satellite mapping displaying real-time GPS coordinates of on-call emergency specialists.
- **Dynamic Telemetry Gauges**: Real-time transit speed, device battery level, reverse-geocoded street address, and live arrival ETAs for trauma response triage.

### 2. 🩺 Outpatient Clinical Desk (OPD)
- **Unified Patient EHR**: Longitudinal clinical encounter records, vitals graphs, allergy alerts, and timeline history.
- **Smart Prescriptions**: Auto-completing medicine registry, dosage calculators, and structured drug frequency schedules.
- **AI Medical Copilot**: Clinical guidance assistant for ICD-10 diagnostic coding, drug-drug interaction screening, and patient summary generation.

### 3. 🛏️ Inpatient Bed Ward Grid Matrix (IPD)
- **Floor-by-Floor Visual Bed Matrix**: Real-time occupancy tracking across ICU, CCU, Emergency Trauma, and General Wards.
- **Clinical Vital Monitoring**: Oxygen supply tracking, ventilator connection status, nurse handovers, and discharge clearance checklists.

### 4. 💊 Pharmacy Inventory & ERP
- **Real-Time Stock Ledger**: Automated batch number tracking, expiry date alerts, and reorder threshold warnings.
- **Prescription Validation**: One-click prescription fulfillment and automatic stock deduction linked to patient billing.

### 5. 🧪 Laboratory Information System (LIS)
- Pathology and radiology lab requisition workflows.
- Diagnostic test status tracking with automated normal/abnormal parameter highlighting.

### 6. 👤 Patient Self-Service Portal & e-KYC
- **Digital Appointment Booking**: Real-time doctor slot availability, specialty filtering, and consultation scheduling.
- **Aadhaar e-KYC Integration**: 1-click OTP verification and profile synchronization.
- **Health Records & Invoices**: Downloadable lab findings, medical prescriptions, and detailed payment receipts.

### 7. 📲 Multi-Channel Communication Engine
- **WhatsApp Integration (Green-API)**: Instant appointment confirmations, doctor schedules, and digital invoices sent directly to patient WhatsApp numbers.
- **SMTP Email Dispatch**: Automated booking receipts and emergency trauma dispatch alerts via secure TLS.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Leaflet Maps |
| **Backend** | Java 21, Spring Boot 3.3.4, Spring Security, Spring Data JPA, Hibernate |
| **Database** | PostgreSQL 16 (Relational schema with HikariCP connection pooling) |
| **Mobile** | Flutter / Dart (Doctor location broadcast application) |
| **Integrations** | Green-API (WhatsApp REST API), JavaMailSender (SMTP) |

---

## 🚀 Getting Started

### Prerequisites
- **Java**: JDK 21+
- **Node.js**: v18+ and npm
- **Database**: PostgreSQL 14+ running locally on port `5432` with a database named `hospital_db`

---

### Backend Setup (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure database credentials in `src/main/resources/application.yml` if necessary:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/hospital_db
       username: postgres
       password: root
   ```

3. Run the Spring Boot application (using the bundled Maven wrapper):
   ```bash
   # Windows
   .\mvnw.cmd spring-boot:run

   # macOS / Linux
   ./mvnw spring-boot:run
   ```
   The backend API will start at: `http://localhost:8080`

---

### Frontend Setup (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application UI will be available at: `http://localhost:5175`

---

## 🔑 Demo Login Credentials

The application includes convenient **1-Click Instant Demo Login** buttons on the login page:

| Role | Username / ID | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `password123` | Full clinical, administrative, and configuration control |
| **Chief Doctor** | `dr.arun` | `password123` | OPD desk, patient consultations, prescriptions |
| **Ward Nurse** | `nurse.kavitha` | `password123` | IPD ward bed matrix, vitals, inpatient care |
| **Front Desk** | `reception` | `password123` | Patient registrations, appointment scheduling |
| **Patient Portal** | `patient.rajesh` | `password123` | Self-service bookings, lab reports, invoices |

---

## 📁 Repository Structure

```text
├── backend/                       # Spring Boot REST API
│   ├── src/main/java/             # Controllers, Services, Models, Repositories
│   ├── src/main/resources/        # application.yml, DB migrations, sample data
│   └── pom.xml                    # Maven dependencies
├── frontend/                      # React 18 + Vite UI
│   ├── src/pages/                 # Clinical, Administrative, and Patient views
│   ├── src/components/            # UI components, layout, maps, and modals
│   ├── src/context/               # AuthContext, ThemeContext
│   └── package.json               # Frontend dependencies
├── mobile_doctor_tracker/         # Flutter mobile tracking application
├── .gitignore                     # Git ignore rules
└── README.md                      # Project documentation
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
