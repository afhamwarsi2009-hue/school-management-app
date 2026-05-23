import { Route, Routes } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout.jsx';
import { DashboardLayout } from '../layouts/DashboardLayout.jsx';
import { HomePage } from '../pages/HomePage.jsx';
import { AboutPage } from '../pages/AboutPage.jsx';
import { AdmissionsPage } from '../pages/AdmissionsPage.jsx';
import { PaymentPage } from '../pages/PaymentPage.jsx';
import { LegalPage } from '../pages/LegalPage.jsx';
import { PrincipalMessagePage } from '../pages/PrincipalMessagePage.jsx';
import { AcademicsPage } from '../pages/AcademicsPage.jsx';
import { FacultyPage } from '../pages/FacultyPage.jsx';
import { GalleryPage } from '../pages/GalleryPage.jsx';
import { EventsNewsPage } from '../pages/EventsNewsPage.jsx';
import { NoticeBoardPage } from '../pages/NoticeBoardPage.jsx';
import { ContactPage } from '../pages/ContactPage.jsx';
import { FAQPage } from '../pages/FAQPage.jsx';
import { AdminDashboard } from '../dashboard/AdminDashboard.jsx';
import { StudentDashboard } from '../dashboard/StudentDashboard.jsx';
import { ParentDashboard } from '../dashboard/ParentDashboard.jsx';
import { LoginPage } from '../authentication/LoginPage.jsx';
import { StudentRegisterPage } from '../authentication/StudentRegisterPage.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';
import { PaymentSuccessPage } from '../pages/PaymentSuccessPage.jsx';
import { PaymentFailurePage } from '../pages/PaymentFailurePage.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="principal-message" element={<PrincipalMessagePage />} />
        <Route path="admissions" element={<AdmissionsPage />} />
        <Route path="academics" element={<AcademicsPage />} />
        <Route path="faculty" element={<FacultyPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="events-news" element={<EventsNewsPage />} />
        <Route path="notice-board" element={<NoticeBoardPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="payments" element={<PaymentPage />} />
        <Route path="login/:role" element={<LoginPage />} />
        <Route path="register/student" element={<StudentRegisterPage />} />
        <Route path="payment-success" element={<PaymentSuccessPage />} />
        <Route path="payment-failure" element={<PaymentFailurePage />} />
        <Route path="privacy-policy" element={<LegalPage policy="privacy-policy" />} />
        <Route path="refund-policy" element={<LegalPage policy="refund-policy" />} />
        <Route path="terms-and-conditions" element={<LegalPage policy="terms-and-conditions" />} />
        <Route path="disclaimer" element={<LegalPage policy="disclaimer" />} />
        <Route path="cancellation-policy" element={<LegalPage policy="cancellation-policy" />} />
        <Route path="legal/:policy" element={<LegalPage />} />
      </Route>
      <Route element={<ProtectedRoute roles={['admin']} loginRole="admin" />}>
        <Route element={<DashboardLayout />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute roles={['student']} loginRole="student" />}>
        <Route element={<DashboardLayout />}>
          <Route path="student" element={<StudentDashboard />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute roles={['student', 'admin']} loginRole="student" />}>
        <Route element={<DashboardLayout />}>
          <Route path="parent" element={<ParentDashboard />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
