import { useEffect, useMemo, useState } from 'react';
import { Award, Bell, BookOpen, ClipboardCheck, CreditCard, IndianRupee, Mail, Plus, Trash2, Users } from 'lucide-react';
import { apiClient } from '../services/apiClient.js';

const today = new Date().toISOString().slice(0, 10);

const emptyStudent = {
  admission_number: '',
  name: '',
  email: '',
  class: '',
  roll_number: '',
  total_fees: '',
  paid_fees: 0,
  password: ''
};

const emptyPayment = { student_id: '', amount: '', payment_mode: 'Online', status: 'Success' };
const emptyNotice = { title: '', body: '', audience: 'All', is_published: true };
const emptyAttendance = { student_id: '', attendance_date: today, status: 'Present', remarks: '' };
const emptyHomework = { student_id: '', class: '', subject: '', title: '', description: '', due_date: today };
const emptyResult = { student_id: '', exam_name: '', subject: '', marks_obtained: '', max_marks: '', grade: '' };

function money(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value || 0));
}

function rowId(row) {
  return row.id || row.StudentId || row.PaymentId || row.EnquiryId || row.NoticeId || row.AttendanceId || row.HomeworkId || row.ResultId;
}

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [notices, setNotices] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [homework, setHomework] = useState([]);
  const [results, setResults] = useState([]);
  const [studentForm, setStudentForm] = useState(emptyStudent);
  const [paymentForm, setPaymentForm] = useState(emptyPayment);
  const [noticeForm, setNoticeForm] = useState(emptyNotice);
  const [attendanceForm, setAttendanceForm] = useState(emptyAttendance);
  const [homeworkForm, setHomeworkForm] = useState(emptyHomework);
  const [resultForm, setResultForm] = useState(emptyResult);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');

  const metricCards = useMemo(() => [
    ['Total students', stats?.total_students || 0, Users],
    ['Fees collected', money(stats?.total_fees_collected), IndianRupee],
    ['Pending fees', money(stats?.pending_fees), CreditCard],
    ['Contact enquiries', contacts.length, Mail]
  ], [stats, contacts.length]);

  async function loadDashboard() {
    const [
      nextStats,
      nextStudents,
      nextPayments,
      nextContacts,
      nextNotices,
      nextAttendance,
      nextHomework,
      nextResults
    ] = await Promise.all([
      apiClient('/admin/stats'),
      apiClient('/students'),
      apiClient('/admin/payments'),
      apiClient('/contact'),
      apiClient('/notices'),
      apiClient('/attendance'),
      apiClient('/homework'),
      apiClient('/results')
    ]);

    setStats(nextStats);
    setStudents(nextStudents);
    setPayments(nextPayments);
    setContacts(nextContacts);
    setNotices(nextNotices);
    setAttendance(nextAttendance);
    setHomework(nextHomework);
    setResults(nextResults);
  }

  useEffect(() => {
    loadDashboard().catch((error) => setStatus(error.message));
  }, []);

  async function handleStudentSubmit(event) {
    event.preventDefault();
    setStatus(editingId ? 'Updating student...' : 'Adding student...');
    const payload = {
      name: studentForm.name,
      admission_number: studentForm.admission_number || studentForm.roll_number,
      email: studentForm.email,
      class: studentForm.class,
      roll_number: studentForm.roll_number,
      total_fees: Number(studentForm.total_fees),
      paid_fees: Number(studentForm.paid_fees || 0),
      password: studentForm.password
    };
    if (!payload.password) delete payload.password;

    try {
      await apiClient(editingId ? `/students/${editingId}` : '/students', {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      });
      setStudentForm(emptyStudent);
      setEditingId(null);
      await loadDashboard();
      setStatus('Student saved successfully.');
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function deleteStudent(studentId) {
    setStatus('Deleting student...');
    try {
      await apiClient(`/students/${studentId}`, { method: 'DELETE' });
      await loadDashboard();
      setStatus('Student deleted.');
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function submitManagementForm(event, endpoint, form, resetForm, successMessage) {
    event.preventDefault();
    setStatus('Saving...');
    try {
      await apiClient(endpoint, { method: 'POST', body: JSON.stringify(form) });
      resetForm();
      await loadDashboard();
      setStatus(successMessage);
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <section className="dashboard-stack">
      <div className="dashboard-heading">
        <div>
          <span>Admin Panel</span>
          <h1>School operations</h1>
        </div>
      </div>

      <div className="dashboard-grid">
        {metricCards.map(([label, value, Icon]) => (
          <article className="dashboard-card" key={label}>
            <Icon size={24} />
            <p>{label}</p>
            <h2>{value}</h2>
          </article>
        ))}
      </div>

      <section className="management-layout">
        <form className="dashboard-panel" onSubmit={handleStudentSubmit}>
          <h2>{editingId ? 'Edit student' : 'Add student'}</h2>
          {['admission_number', 'name', 'email', 'class', 'roll_number', 'total_fees', 'paid_fees', 'password'].map((field) => (
            <label key={field}>
              {field.replace('_', ' ')}
              <input
                type={field.includes('fees') ? 'number' : field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                value={studentForm[field]}
                onChange={(event) => setStudentForm({ ...studentForm, [field]: event.target.value })}
                required={field !== 'paid_fees' && field !== 'password'}
              />
            </label>
          ))}
          <button className="primary-button" type="submit"><Plus size={18} /> Save Student</button>
          {status && <p className="form-status">{status}</p>}
        </form>

        <div className="dashboard-panel table-panel">
          <h2>Manage students</h2>
          <table>
            <thead><tr><th>Name</th><th>Class</th><th>Total</th><th>Paid</th><th></th></tr></thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}<small>{student.email}</small></td>
                  <td>{student.class}</td>
                  <td>{money(student.total_fees)}</td>
                  <td>{money(student.paid_fees)}</td>
                  <td className="row-actions">
                    <button type="button" onClick={() => { setEditingId(student.id); setStudentForm({ ...student, password: '' }); }}>Edit</button>
                    <button type="button" aria-label="Delete student" onClick={() => deleteStudent(student.id)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="management-layout">
        <form
          className="dashboard-panel"
          onSubmit={(event) => submitManagementForm(
            event,
            '/payments',
            { ...paymentForm, student_id: Number(paymentForm.student_id), amount: Number(paymentForm.amount) },
            () => setPaymentForm(emptyPayment),
            'Fee payment saved.'
          )}
        >
          <h2>Manage fees</h2>
          <label>Student ID<input type="number" value={paymentForm.student_id} onChange={(event) => setPaymentForm({ ...paymentForm, student_id: event.target.value })} required /></label>
          <label>Amount<input type="number" min="1" value={paymentForm.amount} onChange={(event) => setPaymentForm({ ...paymentForm, amount: event.target.value })} required /></label>
          <label>Payment mode<input type="text" value={paymentForm.payment_mode} onChange={(event) => setPaymentForm({ ...paymentForm, payment_mode: event.target.value })} /></label>
          <button className="primary-button" type="submit"><CreditCard size={18} /> Save Fee</button>
        </form>

        <div className="dashboard-panel table-panel">
          <h2>Payment history</h2>
          <table>
            <thead><tr><th>Student</th><th>Amount</th><th>Payment ID</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.student_name}</td>
                  <td>{money(payment.amount)}</td>
                  <td>{payment.razorpay_payment_id || payment.id}</td>
                  <td>{payment.status}</td>
                  <td>{new Date(payment.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="management-layout">
        <form
          className="dashboard-panel"
          onSubmit={(event) => submitManagementForm(event, '/notices', noticeForm, () => setNoticeForm(emptyNotice), 'Notice uploaded.')}
        >
          <h2>Upload notices</h2>
          <label>Title<input type="text" value={noticeForm.title} onChange={(event) => setNoticeForm({ ...noticeForm, title: event.target.value })} required /></label>
          <label>Audience<input type="text" value={noticeForm.audience} onChange={(event) => setNoticeForm({ ...noticeForm, audience: event.target.value })} /></label>
          <label>Body<textarea rows="4" value={noticeForm.body} onChange={(event) => setNoticeForm({ ...noticeForm, body: event.target.value })} required /></label>
          <button className="primary-button" type="submit"><Bell size={18} /> Publish Notice</button>
        </form>

        <div className="dashboard-panel table-panel">
          <h2>Notice board</h2>
          <table>
            <thead><tr><th>Title</th><th>Audience</th><th>Published</th></tr></thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.id}>
                  <td>{notice.title}<small>{notice.body}</small></td>
                  <td>{notice.audience}</td>
                  <td>{notice.published_at ? new Date(notice.published_at).toLocaleDateString() : 'Draft'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="management-layout">
        <form
          className="dashboard-panel"
          onSubmit={(event) => submitManagementForm(
            event,
            '/attendance',
            { ...attendanceForm, student_id: Number(attendanceForm.student_id) },
            () => setAttendanceForm(emptyAttendance),
            'Attendance saved.'
          )}
        >
          <h2>Manage attendance</h2>
          <label>Student ID<input type="number" value={attendanceForm.student_id} onChange={(event) => setAttendanceForm({ ...attendanceForm, student_id: event.target.value })} required /></label>
          <label>Date<input type="date" value={attendanceForm.attendance_date} onChange={(event) => setAttendanceForm({ ...attendanceForm, attendance_date: event.target.value })} required /></label>
          <label>
            Status
            <select value={attendanceForm.status} onChange={(event) => setAttendanceForm({ ...attendanceForm, status: event.target.value })} required>
              {['Present', 'Absent', 'Late', 'Leave'].map((statusOption) => <option key={statusOption} value={statusOption}>{statusOption}</option>)}
            </select>
          </label>
          <label>Remarks<input type="text" value={attendanceForm.remarks} onChange={(event) => setAttendanceForm({ ...attendanceForm, remarks: event.target.value })} /></label>
          <button className="primary-button" type="submit"><ClipboardCheck size={18} /> Save Attendance</button>
        </form>

        <div className="dashboard-panel table-panel">
          <h2>Attendance records</h2>
          <table>
            <thead><tr><th>Student ID</th><th>Date</th><th>Status</th><th>Remarks</th></tr></thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record.id}>
                  <td>{record.student_id}</td>
                  <td>{new Date(record.attendance_date).toLocaleDateString()}</td>
                  <td>{record.status}</td>
                  <td>{record.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="management-layout">
        <form
          className="dashboard-panel"
          onSubmit={(event) => submitManagementForm(
            event,
            '/homework',
            { ...homeworkForm, student_id: homeworkForm.student_id ? Number(homeworkForm.student_id) : null },
            () => setHomeworkForm(emptyHomework),
            'Homework saved.'
          )}
        >
          <h2>Manage homework</h2>
          <label>Student ID<input type="number" value={homeworkForm.student_id} onChange={(event) => setHomeworkForm({ ...homeworkForm, student_id: event.target.value })} /></label>
          <label>Class<input type="text" value={homeworkForm.class} onChange={(event) => setHomeworkForm({ ...homeworkForm, class: event.target.value })} required /></label>
          <label>Subject<input type="text" value={homeworkForm.subject} onChange={(event) => setHomeworkForm({ ...homeworkForm, subject: event.target.value })} required /></label>
          <label>Title<input type="text" value={homeworkForm.title} onChange={(event) => setHomeworkForm({ ...homeworkForm, title: event.target.value })} required /></label>
          <label>Due date<input type="date" value={homeworkForm.due_date} onChange={(event) => setHomeworkForm({ ...homeworkForm, due_date: event.target.value })} required /></label>
          <label>Description<textarea rows="4" value={homeworkForm.description} onChange={(event) => setHomeworkForm({ ...homeworkForm, description: event.target.value })} /></label>
          <button className="primary-button" type="submit"><BookOpen size={18} /> Save Homework</button>
        </form>

        <div className="dashboard-panel table-panel">
          <h2>Homework list</h2>
          <table>
            <thead><tr><th>Class</th><th>Subject</th><th>Title</th><th>Due</th></tr></thead>
            <tbody>
              {homework.map((item) => (
                <tr key={item.id}>
                  <td>{item.class}</td>
                  <td>{item.subject}</td>
                  <td>{item.title}<small>{item.description}</small></td>
                  <td>{new Date(item.due_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="management-layout">
        <form
          className="dashboard-panel"
          onSubmit={(event) => submitManagementForm(
            event,
            '/results',
            {
              ...resultForm,
              student_id: Number(resultForm.student_id),
              marks_obtained: Number(resultForm.marks_obtained),
              max_marks: Number(resultForm.max_marks)
            },
            () => setResultForm(emptyResult),
            'Result saved.'
          )}
        >
          <h2>Manage results</h2>
          <label>Student ID<input type="number" value={resultForm.student_id} onChange={(event) => setResultForm({ ...resultForm, student_id: event.target.value })} required /></label>
          <label>Exam<input type="text" value={resultForm.exam_name} onChange={(event) => setResultForm({ ...resultForm, exam_name: event.target.value })} required /></label>
          <label>Subject<input type="text" value={resultForm.subject} onChange={(event) => setResultForm({ ...resultForm, subject: event.target.value })} required /></label>
          <label>Marks obtained<input type="number" value={resultForm.marks_obtained} onChange={(event) => setResultForm({ ...resultForm, marks_obtained: event.target.value })} required /></label>
          <label>Max marks<input type="number" value={resultForm.max_marks} onChange={(event) => setResultForm({ ...resultForm, max_marks: event.target.value })} required /></label>
          <label>Grade<input type="text" value={resultForm.grade} onChange={(event) => setResultForm({ ...resultForm, grade: event.target.value })} /></label>
          <button className="primary-button" type="submit"><Award size={18} /> Save Result</button>
        </form>

        <div className="dashboard-panel table-panel">
          <h2>Result records</h2>
          <table>
            <thead><tr><th>Student</th><th>Exam</th><th>Subject</th><th>Marks</th><th>Grade</th></tr></thead>
            <tbody>
              {results.map((result) => (
                <tr key={rowId(result)}>
                  <td>{result.StudentName || result.student_name || result.StudentId || result.student_id}</td>
                  <td>{result.ExamName || result.exam_name}</td>
                  <td>{result.Subject || result.subject}</td>
                  <td>{result.MarksObtained ?? result.marks_obtained}/{result.MaxMarks ?? result.max_marks}</td>
                  <td>{result.Grade ?? result.grade ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-panel table-panel">
        <h2>Contact enquiries</h2>
        <table>
          <thead><tr><th>Name</th><th>Phone</th><th>Subject</th><th>Message</th><th>Date</th></tr></thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.name}<small>{contact.email}</small></td>
                <td>{contact.phone || '-'}</td>
                <td>{contact.subject}</td>
                <td>{contact.message}</td>
                <td>{new Date(contact.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}
