import { AdmissionForm } from '../forms/AdmissionForm.jsx';
import { SectionHeader } from '../components/SectionHeader.jsx';

export function AdmissionsPage() {
  return (
    <section className="content-section page-pad">
      <SectionHeader eyebrow="Admissions" title="Digital admission workflow">
        Submit student details, parent contacts, documents, class preferences, and payment intent securely.
      </SectionHeader>
      <AdmissionForm />
    </section>
  );
}
