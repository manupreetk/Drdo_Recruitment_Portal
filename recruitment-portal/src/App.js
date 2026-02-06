import React, { useState } from 'react';
import { Check, Clock, FileText, Upload, User, LogOut, Search, Filter, Eye, Download } from 'lucide-react';

// Mock data
const MOCK_USERS = {
  user: { username: 'applicant@gov.in', password: 'user123', type: 'user', name: 'Rajesh Kumar' },
  admin: { username: 'admin@gov.in', password: 'admin123', type: 'admin', name: 'Admin Officer' }
};

const REQUIRED_DOCS = [
  'Birth Certificate',
  'Educational Certificates',
  'Experience Letters',
  'Caste Certificate (if applicable)',
  'Medical Fitness Certificate',
  'Character Certificate',
  'Photo ID Proof (Aadhaar/PAN)',
  'Passport Size Photographs'
];

const APPLICATION_STAGES = [
  { id: 1, name: 'Application Submitted', status: 'completed', icon: FileText },
  { id: 2, name: 'Document Verification', status: 'completed', icon: FileText },
  { id: 3, name: 'Medical Examination', status: 'in-progress', icon: Clock },
  { id: 4, name: 'Background Verification', status: 'pending', icon: Clock },
  { id: 5, name: 'Final Clearance', status: 'pending', icon: Check }
];

const MOCK_APPLICATIONS = [
  {
    id: 'APP2026001',
    name: 'Rajesh Kumar',
    position: 'Civil Services Officer',
    submittedDate: '2026-01-15',
    currentStage: 'Medical Examination',
    status: 'in-progress',
    email: 'rajesh.k@email.com',
    phone: '+91 98765 43210',
    documents: {
      'Birth Certificate': true,
      'Educational Certificates': true,
      'Experience Letters': true,
      'Caste Certificate (if applicable)': false,
      'Medical Fitness Certificate': false,
      'Character Certificate': true,
      'Photo ID Proof (Aadhaar/PAN)': true,
      'Passport Size Photographs': true
    }
  },
  {
    id: 'APP2026002',
    name: 'Priya Sharma',
    position: 'Administrative Officer',
    submittedDate: '2026-01-20',
    currentStage: 'Document Verification',
    status: 'in-progress',
    email: 'priya.s@email.com',
    phone: '+91 98123 45678',
    documents: {
      'Birth Certificate': true,
      'Educational Certificates': true,
      'Experience Letters': false,
      'Caste Certificate (if applicable)': true,
      'Medical Fitness Certificate': false,
      'Character Certificate': true,
      'Photo ID Proof (Aadhaar/PAN)': true,
      'Passport Size Photographs': true
    }
  },
  {
    id: 'APP2026003',
    name: 'Amit Patel',
    position: 'Technical Officer',
    submittedDate: '2026-01-25',
    currentStage: 'Background Verification',
    status: 'in-progress',
    email: 'amit.p@email.com',
    phone: '+91 97654 32109',
    documents: {
      'Birth Certificate': true,
      'Educational Certificates': true,
      'Experience Letters': true,
      'Caste Certificate (if applicable)': false,
      'Medical Fitness Certificate': true,
      'Character Certificate': true,
      'Photo ID Proof (Aadhaar/PAN)': true,
      'Passport Size Photographs': true
    }
  }
];

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    const user = Object.values(MOCK_USERS).find(
      u => u.username === loginForm.username && u.password === loginForm.password
    );

    if (user) {
      setCurrentUser(user);
    } else {
      setLoginError('Invalid credentials. Try applicant@gov.in/user123 or admin@gov.in/admin123');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginForm({ username: '', password: '' });
    setActiveTab('overview');
  };

  const handleFileUpload = (docName) => {
    setUploadedDocs({ ...uploadedDocs, [docName]: true });
  };

  // Login Page
  if (!currentUser) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a1628 0%, #1a2942 50%, #2d4a6e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Merriweather", Georgia, serif',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255, 183, 77, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(66, 165, 245, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }}></div>
        
        <div style={{
          background: 'linear-gradient(160deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 247, 250, 0.98) 100%)',
          padding: '60px',
          borderRadius: '16px',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.3) inset',
          maxWidth: '480px',
          width: '100%',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {/* Government emblem */}
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <div style={{
              width: '90px',
              height: '90px',
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(255, 107, 53, 0.3)',
              border: '3px solid rgba(255, 255, 255, 0.9)'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #1a2942 0%, #2d4a6e 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFB74D',
                fontSize: '32px',
                fontWeight: 'bold',
                fontFamily: '"Playfair Display", serif'
              }}>
                भ
              </div>
            </div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#0a1628',
              margin: '0 0 8px 0',
              fontFamily: '"Playfair Display", serif',
              letterSpacing: '-0.5px'
            }}>
              Government of India
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#5a6c7d',
              margin: '0 0 4px 0',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              भारत सरकार
            </p>
            <div style={{
              width: '60px',
              height: '3px',
              background: 'linear-gradient(90deg, #FF6B35, #FFB74D)',
              margin: '16px auto 0',
              borderRadius: '2px'
            }}></div>
            <h2 style={{
              fontSize: '20px',
              color: '#2d4a6e',
              margin: '20px 0 0 0',
              fontWeight: '600'
            }}>
              Recruitment Portal
            </h2>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#2d4a6e',
                fontWeight: '600',
                fontSize: '14px',
                letterSpacing: '0.3px'
              }}>
                Email Address
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #d1d9e0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF6B35';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d9e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#2d4a6e',
                fontWeight: '600',
                fontSize: '14px',
                letterSpacing: '0.3px'
              }}>
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #d1d9e0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF6B35';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d9e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {loginError && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#ffebee',
                color: '#c62828',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
                border: '1px solid #ef9a9a'
              }}>
                {loginError}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
              }}
            >
              Sign In
            </button>
          </form>

          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
            borderRadius: '8px',
            border: '1px solid #bbdefb'
          }}>
            <p style={{
              fontSize: '13px',
              color: '#1a237e',
              margin: '0 0 12px 0',
              fontWeight: '600',
              letterSpacing: '0.3px'
            }}>
              Demo Credentials:
            </p>
            <div style={{ fontSize: '13px', color: '#283593', lineHeight: '1.8' }}>
              <div><strong>Applicant:</strong> applicant@gov.in / user123</div>
              <div><strong>Admin:</strong> admin@gov.in / admin123</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User Dashboard
  if (currentUser.type === 'user') {
    const userApplication = MOCK_APPLICATIONS[0];
    
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eef3 100%)',
        fontFamily: '"Merriweather", Georgia, serif'
      }}>
        {/* Header */}
        <header style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #2d4a6e 100%)',
          color: 'white',
          padding: '20px 40px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #FF6B35 0%, #FFB74D 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '20px',
                fontFamily: '"Playfair Display", serif'
              }}>
                भ
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '22px', fontFamily: '"Playfair Display", serif' }}>
                  Government Recruitment Portal
                </h1>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', opacity: 0.9, letterSpacing: '0.5px' }}>
                  भारत सरकार
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>{currentUser.name}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', opacity: 0.8 }}>Applicant</p>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.25)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '32px',
            borderBottom: '2px solid #d1d9e0'
          }}>
            {['overview', 'documents', 'tracking'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '14px 28px',
                  background: activeTab === tab ? 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)' : 'transparent',
                  color: activeTab === tab ? 'white' : '#5a6c7d',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize',
                  letterSpacing: '0.3px'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                marginBottom: '24px',
                border: '1px solid #e3e8ef'
              }}>
                <h2 style={{
                  margin: '0 0 24px 0',
                  fontSize: '26px',
                  color: '#0a1628',
                  fontFamily: '"Playfair Display", serif'
                }}>
                  Application Summary
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px'
                }}>
                  <div>
                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#5a6c7d', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Application ID
                    </p>
                    <p style={{ margin: 0, fontSize: '18px', color: '#0a1628', fontWeight: '700' }}>
                      {userApplication.id}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#5a6c7d', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Position
                    </p>
                    <p style={{ margin: 0, fontSize: '18px', color: '#0a1628', fontWeight: '700' }}>
                      {userApplication.position}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#5a6c7d', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Submitted Date
                    </p>
                    <p style={{ margin: 0, fontSize: '18px', color: '#0a1628', fontWeight: '700' }}>
                      {new Date(userApplication.submittedDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#5a6c7d', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Current Stage
                    </p>
                    <p style={{ margin: 0, fontSize: '18px', color: '#FF6B35', fontWeight: '700' }}>
                      {userApplication.currentStage}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '24px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                  color: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)'
                }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9, fontWeight: '600' }}>
                    Documents Uploaded
                  </p>
                  <p style={{ margin: 0, fontSize: '32px', fontWeight: '800', fontFamily: '"Playfair Display", serif' }}>
                    {Object.values(userApplication.documents).filter(Boolean).length}/{Object.keys(userApplication.documents).length}
                  </p>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
                  color: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)'
                }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9, fontWeight: '600' }}>
                    Stages Completed
                  </p>
                  <p style={{ margin: 0, fontSize: '32px', fontWeight: '800', fontFamily: '"Playfair Display", serif' }}>
                    2/5
                  </p>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
                  color: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.2)'
                }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9, fontWeight: '600' }}>
                    Days Since Application
                  </p>
                  <p style={{ margin: 0, fontSize: '32px', fontWeight: '800', fontFamily: '"Playfair Display", serif' }}>
                    19
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e3e8ef'
              }}>
                <h2 style={{
                  margin: '0 0 8px 0',
                  fontSize: '26px',
                  color: '#0a1628',
                  fontFamily: '"Playfair Display", serif'
                }}>
                  Required Documents
                </h2>
                <p style={{
                  margin: '0 0 32px 0',
                  color: '#5a6c7d',
                  fontSize: '15px'
                }}>
                  Please upload all required documents for your application. Accepted formats: PDF, JPG, PNG (Max 5MB each)
                </p>
                
                <div style={{
                  display: 'grid',
                  gap: '16px'
                }}>
                  {REQUIRED_DOCS.map((doc, index) => {
                    const isUploaded = userApplication.documents[doc];
                    return (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '20px 24px',
                          background: isUploaded ? 'linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%)' : '#fafbfc',
                          border: isUploaded ? '2px solid #4CAF50' : '2px dashed #d1d9e0',
                          borderRadius: '10px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            background: isUploaded ? '#4CAF50' : '#e3e8ef',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isUploaded ? 'white' : '#5a6c7d'
                          }}>
                            {isUploaded ? <Check size={20} /> : <FileText size={20} />}
                          </div>
                          <div>
                            <h3 style={{
                              margin: '0 0 4px 0',
                              fontSize: '16px',
                              color: '#0a1628',
                              fontWeight: '600'
                            }}>
                              {doc}
                            </h3>
                            <p style={{
                              margin: 0,
                              fontSize: '13px',
                              color: isUploaded ? '#2e7d32' : '#5a6c7d',
                              fontWeight: '600'
                            }}>
                              {isUploaded ? 'Uploaded Successfully' : 'Not Uploaded'}
                            </p>
                          </div>
                        </div>
                        {!isUploaded && (
                          <button
                            onClick={() => handleFileUpload(doc)}
                            style={{
                              padding: '10px 20px',
                              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                          >
                            <Upload size={16} />
                            Upload
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tracking Tab */}
          {activeTab === 'tracking' && (
            <div>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e3e8ef'
              }}>
                <h2 style={{
                  margin: '0 0 8px 0',
                  fontSize: '26px',
                  color: '#0a1628',
                  fontFamily: '"Playfair Display", serif'
                }}>
                  Application Status Tracker
                </h2>
                <p style={{
                  margin: '0 0 40px 0',
                  color: '#5a6c7d',
                  fontSize: '15px'
                }}>
                  Track your application progress through each stage of the recruitment process
                </p>

                <div style={{ position: 'relative' }}>
                  {APPLICATION_STAGES.map((stage, index) => {
                    const isCompleted = stage.status === 'completed';
                    const isInProgress = stage.status === 'in-progress';
                    const isPending = stage.status === 'pending';
                    const StageIcon = stage.icon;
                    
                    return (
                      <div key={stage.id} style={{ position: 'relative', marginBottom: index === APPLICATION_STAGES.length - 1 ? 0 : '24px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '20px'
                        }}>
                          {/* Icon */}
                          <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: isCompleted ? 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)' :
                                        isInProgress ? 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)' :
                                        '#e3e8ef',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isCompleted || isInProgress ? 'white' : '#5a6c7d',
                            boxShadow: isCompleted ? '0 4px 12px rgba(76, 175, 80, 0.3)' :
                                       isInProgress ? '0 4px 12px rgba(255, 107, 53, 0.3)' : 'none',
                            position: 'relative',
                            zIndex: 2,
                            flexShrink: 0
                          }}>
                            <StageIcon size={24} />
                          </div>

                          {/* Content */}
                          <div style={{
                            flex: 1,
                            padding: '8px 0'
                          }}>
                            <h3 style={{
                              margin: '0 0 8px 0',
                              fontSize: '18px',
                              color: isCompleted || isInProgress ? '#0a1628' : '#8b9aab',
                              fontWeight: '700'
                            }}>
                              {stage.name}
                            </h3>
                            <p style={{
                              margin: 0,
                              fontSize: '14px',
                              color: isCompleted ? '#2e7d32' :
                                     isInProgress ? '#FF6B35' :
                                     '#8b9aab',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              {isCompleted && '✓ Completed'}
                              {isInProgress && '⏳ In Progress'}
                              {isPending && '○ Pending'}
                            </p>
                            {isInProgress && (
                              <div style={{
                                marginTop: '12px',
                                padding: '12px 16px',
                                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                                borderRadius: '8px',
                                fontSize: '14px',
                                color: '#e65100',
                                border: '1px solid #ffb74d'
                              }}>
                                Medical examination scheduled for February 10, 2026 at 10:00 AM
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Connector Line */}
                        {index < APPLICATION_STAGES.length - 1 && (
                          <div style={{
                            position: 'absolute',
                            left: '27px',
                            top: '56px',
                            width: '2px',
                            height: '24px',
                            background: isCompleted ? 'linear-gradient(to bottom, #4CAF50, #66BB6A)' : '#e3e8ef',
                            zIndex: 1
                          }}></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eef3 100%)',
      fontFamily: '"Merriweather", Georgia, serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #2d4a6e 100%)',
        color: 'white',
        padding: '20px 40px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #FF6B35 0%, #FFB74D 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '20px',
              fontFamily: '"Playfair Display", serif'
            }}>
              भ
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontFamily: '"Playfair Display", serif' }}>
                Admin Dashboard
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', opacity: 0.9, letterSpacing: '0.5px' }}>
                Recruitment Management System
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>{currentUser.name}</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', opacity: 0.8 }}>Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.25)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px' }}>
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
            color: 'white',
            padding: '28px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9, fontWeight: '600' }}>
              Total Applications
            </p>
            <p style={{ margin: 0, fontSize: '40px', fontWeight: '800', fontFamily: '"Playfair Display", serif' }}>
              {MOCK_APPLICATIONS.length}
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
            color: 'white',
            padding: '28px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.2)'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9, fontWeight: '600' }}>
              In Progress
            </p>
            <p style={{ margin: 0, fontSize: '40px', fontWeight: '800', fontFamily: '"Playfair Display", serif' }}>
              {MOCK_APPLICATIONS.filter(app => app.status === 'in-progress').length}
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
            color: 'white',
            padding: '28px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9, fontWeight: '600' }}>
              Completed This Week
            </p>
            <p style={{ margin: 0, fontSize: '40px', fontWeight: '800', fontFamily: '"Playfair Display", serif' }}>
              0
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
            color: 'white',
            padding: '28px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(156, 39, 176, 0.2)'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9, fontWeight: '600' }}>
              Pending Reviews
            </p>
            <p style={{ margin: 0, fontSize: '40px', fontWeight: '800', fontFamily: '"Playfair Display", serif' }}>
              2
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          marginBottom: '24px',
          border: '1px solid #e3e8ef',
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8b9aab'
            }} />
            <input
              type="text"
              placeholder="Search by name, ID, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: '2px solid #d1d9e0',
                borderRadius: '8px',
                fontSize: '15px',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </div>
          <button style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Applications Table */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e3e8ef',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '24px 32px',
            borderBottom: '2px solid #e3e8ef'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '22px',
              color: '#0a1628',
              fontFamily: '"Playfair Display", serif'
            }}>
              All Applications
            </h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ background: '#fafbfc' }}>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#5a6c7d',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '2px solid #e3e8ef'
                  }}>
                    Application ID
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#5a6c7d',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '2px solid #e3e8ef'
                  }}>
                    Applicant Name
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#5a6c7d',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '2px solid #e3e8ef'
                  }}>
                    Position
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#5a6c7d',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '2px solid #e3e8ef'
                  }}>
                    Current Stage
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#5a6c7d',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '2px solid #e3e8ef'
                  }}>
                    Status
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#5a6c7d',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '2px solid #e3e8ef'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_APPLICATIONS.map((app, index) => (
                  <tr
                    key={app.id}
                    style={{
                      borderBottom: index < MOCK_APPLICATIONS.length - 1 ? '1px solid #e3e8ef' : 'none',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '20px 24px', fontSize: '15px', color: '#0a1628', fontWeight: '700' }}>
                      {app.id}
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '15px', color: '#0a1628', fontWeight: '600' }}>
                      {app.name}
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '15px', color: '#5a6c7d' }}>
                      {app.position}
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '15px', color: '#5a6c7d' }}>
                      {app.currentStage}
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{
                        padding: '6px 14px',
                        background: app.status === 'in-progress' ? '#fff3e0' : '#e8f5e9',
                        color: app.status === 'in-progress' ? '#e65100' : '#2e7d32',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '700',
                        textTransform: 'capitalize',
                        display: 'inline-block'
                      }}>
                        {app.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <button
                        onClick={() => setSelectedApplication(app)}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(10, 22, 40, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setSelectedApplication(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '32px',
              borderBottom: '2px solid #e3e8ef',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: 'white',
              zIndex: 1
            }}>
              <div>
                <h2 style={{
                  margin: '0 0 8px 0',
                  fontSize: '28px',
                  color: '#0a1628',
                  fontFamily: '"Playfair Display", serif'
                }}>
                  Application Details
                </h2>
                <p style={{ margin: 0, fontSize: '15px', color: '#5a6c7d' }}>
                  {selectedApplication.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#f5f7fa',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#5a6c7d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e3e8ef';
                  e.target.style.color = '#0a1628';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f5f7fa';
                  e.target.style.color = '#5a6c7d';
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              {/* Applicant Info */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '20px',
                  color: '#0a1628',
                  fontWeight: '700'
                }}>
                  Applicant Information
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '20px'
                }}>
                  <div>
                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#5a6c7d', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Full Name
                    </p>
                    <p style={{ margin: 0, fontSize: '16px', color: '#0a1628', fontWeight: '600' }}>
                      {selectedApplication.name}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#5a6c7d', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Position Applied
                    </p>
                    <p style={{ margin: 0, fontSize: '16px', color: '#0a1628', fontWeight: '600' }}>
                      {selectedApplication.position}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#5a6c7d', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Email
                    </p>
                    <p style={{ margin: 0, fontSize: '16px', color: '#0a1628', fontWeight: '600' }}>
                      {selectedApplication.email}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#5a6c7d', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Phone
                    </p>
                    <p style={{ margin: 0, fontSize: '16px', color: '#0a1628', fontWeight: '600' }}>
                      {selectedApplication.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '20px',
                  color: '#0a1628',
                  fontWeight: '700'
                }}>
                  Submitted Documents
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {Object.entries(selectedApplication.documents).map(([doc, uploaded]) => (
                    <div
                      key={doc}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 20px',
                        background: uploaded ? '#e8f5e9' : '#ffebee',
                        borderRadius: '8px',
                        border: `1px solid ${uploaded ? '#4CAF50' : '#ef5350'}`
                      }}
                    >
                      <span style={{
                        fontSize: '15px',
                        color: '#0a1628',
                        fontWeight: '600'
                      }}>
                        {doc}
                      </span>
                      <span style={{
                        fontSize: '13px',
                        color: uploaded ? '#2e7d32' : '#c62828',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {uploaded ? (
                          <>
                            <Check size={16} />
                            Uploaded
                          </>
                        ) : (
                          <>
                            <Clock size={16} />
                            Pending
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                paddingTop: '24px',
                borderTop: '2px solid #e3e8ef'
              }}>
                <button style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '700',
                  transition: 'all 0.2s'
                }}>
                  Approve Stage
                </button>
                <button style={{
                  flex: 1,
                  padding: '14px',
                  background: '#e3e8ef',
                  color: '#5a6c7d',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '700',
                  transition: 'all 0.2s'
                }}>
                  Request More Info
                </button>
                <button style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '700',
                  transition: 'all 0.2s'
                }}>
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;