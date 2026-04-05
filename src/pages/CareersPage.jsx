import React, { useState } from 'react';
import { Upload, Briefcase, GraduationCap, Link as LinkIcon, FileText, CheckCircle, AlertCircle, X, MapPin, Clock, Info } from 'lucide-react';
import '../App.css';
import { useAuth } from '../context/AuthContext';

const CareersPage = () => {
    const { user, token, logout } = useAuth();
    const [selectedJob, setSelectedJob] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [formData, setFormData] = useState({
        experience: '',
        education: '',
        resumeUrl: '',
        portfolioUrl: '',
        coverLetter: ''
    });

    const openPositions = [
        { title: 'Senior Full Stack Developer', department: 'Engineering', location: 'Bangalore, India', type: 'Full-time' },
        { title: 'Product Manager', department: 'Product', location: 'Mumbai, India', type: 'Full-time' },
        { title: 'UI/UX Designer', department: 'Design', location: 'Remote', type: 'Full-time' },
        { title: 'Customer Support Executive', department: 'Support', location: 'Delhi, India', type: 'Full-time' },
        { title: 'Marketing Manager', department: 'Marketing', location: 'Bangalore, India', type: 'Full-time' },
        { title: 'Data Analyst', department: 'Analytics', location: 'Pune, India', type: 'Full-time' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !token) {
            setStatus({ type: 'error', msg: 'Please login to apply for positions.' });
            return;
        }

        setSubmitting(true);
        setStatus({ type: '', msg: '' });

        try {
            const res = await fetch('http://localhost:5000/api/jobs/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    jobTitle: selectedJob.title,
                    ...formData
                })
            });

            const data = await res.json();
            if (res.ok) {
                setStatus({ type: 'success', msg: 'Application submitted successfully! Our team will review it soon.' });
                setTimeout(() => setIsApplying(false), 3000);
            } else {
                if(res.status === 401) {
                    setStatus({ type: 'error', msg: 'Your session has expired. Please logout and login again.' });
                } else {
                    setStatus({ type: 'error', msg: data.message || 'Failed to submit application' });
                }
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'Server error. Please try again later.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', color: '#fff', paddingBottom: 100 }}>
            {/* Hero Section */}
            <section style={{ padding: '100px 20px', textAlign: 'center' }}>
                <div className="container">
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: 20, background: 'linear-gradient(to right, #fff, #9A7EAE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Join Our Creative Team
                    </h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', color: '#94a3b8', lineHeight: 1.8 }}>
                        Help us build the future of travel. We are looking for passionate individuals to join our global mission.
                    </p>
                </div>
            </section>

            {/* Open Positions */}
            <section className="container" style={{ maxWidth: 1000 }}>
                <div style={{ display: 'grid', gap: 20 }}>
                    {openPositions.map((job, i) => (
                        <div key={i} style={{
                            background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '30px 40px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s ease'
                        }} className="job-card">
                            <div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 12 }}>{job.title}</h3>
                                <div style={{ display: 'flex', gap: 24, color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Briefcase size={16} color="#9A7EAE" /> {job.department}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <MapPin size={16} color="#9A7EAE" /> {job.location}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Clock size={16} color="#9A7EAE" /> {job.type}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => { setSelectedJob(job); setIsApplying(true); setStatus({type:'', msg:''}); }}
                                style={{
                                    background: 'linear-gradient(135deg, #9A7EAE, #6366f1)', color: '#fff',
                                    border: 'none', borderRadius: 16, padding: '14px 28px', fontWeight: 800,
                                    cursor: 'pointer', boxShadow: '0 8px 20px rgba(154,126,174,0.3)', transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                                onMouseLeave={e => e.currentTarget.style.transform='none'}
                            >
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Application Modal */}
            {isApplying && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(8px)', padding: 20
                }}>
                    <div style={{
                        background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 32,
                        width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', position: 'relative',
                        padding: 40, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                    }}>
                        <button onClick={() => setIsApplying(false)} style={{ position: 'absolute', top: 24, right: 24, color: '#64748b', cursor: 'pointer' }}><X size={24}/></button>
                        
                        <div style={{ marginBottom: 32 }}>
                            <span style={{ color: '#9A7EAE', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>Application Form</span>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginTop: 8 }}>{selectedJob?.title}</h2>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Please fill in the details below to join our team.</p>
                        </div>

                        {status.msg && (
                            <div style={{
                                padding: 16, borderRadius: 16, marginBottom: 24, fontSize: '0.9rem', fontWeight: 600,
                                background: status.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                border: status.type === 'success' ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(239,68,68,0.2)',
                                color: status.type === 'success' ? '#4ade80' : '#f87171',
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                {status.type === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
                                {status.msg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 24 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#9A7EAE', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Work Experience</label>
                                    <div style={{ position: 'relative' }}>
                                        <Briefcase size={16} color="#64748b" style={{ position: 'absolute', left: 14, top: 12 }} />
                                        <input required placeholder="e.g. 5 Years" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})}
                                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 14px 12px 42px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#9A7EAE', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Education</label>
                                    <div style={{ position: 'relative' }}>
                                        <GraduationCap size={16} color="#64748b" style={{ position: 'absolute', left: 14, top: 12 }} />
                                        <input required placeholder="e.g. B.Tech CS" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})}
                                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 14px 12px 42px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.75rem', color: '#9A7EAE', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Resume Link (Drive/Dropbox/Cloud)</label>
                                <div style={{ position: 'relative' }}>
                                    <LinkIcon size={16} color="#64748b" style={{ position: 'absolute', left: 14, top: 12 }} />
                                    <input required type="url" placeholder="https://..." value={formData.resumeUrl} onChange={e => setFormData({...formData, resumeUrl: e.target.value})}
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 14px 12px 42px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
                                </div>
                                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 6, display: 'block' }}><Info size={10}/> Ensure the link is publicly accessible for review.</span>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.75rem', color: '#9A7EAE', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Portfolio / LinkedIn (Optional)</label>
                                <div style={{ position: 'relative' }}>
                                    <FileText size={16} color="#64748b" style={{ position: 'absolute', left: 14, top: 12 }} />
                                    <input type="url" placeholder="https://..." value={formData.portfolioUrl} onChange={e => setFormData({...formData, portfolioUrl: e.target.value})}
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 14px 12px 42px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.75rem', color: '#9A7EAE', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Tell us about yourself / Cover Letter</label>
                                <textarea placeholder="Write a brief intro..." rows={4} value={formData.coverLetter} onChange={e => setFormData({...formData, coverLetter: e.target.value})}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: '#fff', fontSize: '0.9rem', outline: 'none', resize: 'none' }} />
                            </div>

                            <button disabled={submitting} type="submit" style={{
                                width: '100%', padding: '16px', borderRadius: 16, background: 'linear-gradient(to right, #9A7EAE, #6366f1)',
                                color: '#fff', fontWeight: 800, fontSize: '1rem', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                                marginTop: 10, boxShadow: '0 10px 25px rgba(99,102,241,0.3)', transition: 'all 0.3s'
                            }}>
                                {submitting ? 'Submitting Application...' : 'Send Application'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareersPage;
