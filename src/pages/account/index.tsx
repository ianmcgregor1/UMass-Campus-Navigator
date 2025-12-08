
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './account.module.scss';

function AccountPage() {
  const { isLoggedIn, user, login, logout } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user || data);
        setFormData({ email: '', password: '', name: '' });
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user || data);
        setFormData({ email: '', password: '', name: '' });
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setFormData({ email: '', password: '', name: '' });
  };

  // Login/Register Form
  if (!isLoggedIn) {
    return (
      <div className={styles.page}>
        <div className={styles.loginContainer}>
          <div className={styles.loginBox}>
            <h2>{isRegistering ? 'Create Account' : 'Login'}</h2>
            
            {error && <div className={styles.error}>{error}</div>}
            
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
              {isRegistering && (
                <div className={styles.formGroup}>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
              )}
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
              
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isRegistering ? 'Register' : 'Login')}
              </button>
            </form>
            
            <div className={styles.toggleForm}>
              {isRegistering ? (
                <p>
                  Already have an account?{' '}
                  <button 
                    onClick={() => { setIsRegistering(false); setError(''); }}
                    className={styles.linkButton}
                  >
                    Login here
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => { setIsRegistering(true); setError(''); }}
                    className={styles.linkButton}
                  >
                    Register here
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Account Page (when logged in)
  return (
    <div className={styles.page}>
      <div className={styles.accountNAV}>
        
        <div className={styles.navLeft}>
          <h2>Account Details</h2>
        </div>

        <div className={styles.navRight}>
          <button className={styles.navButton}>Help</button>
          <button className={styles.navButton} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className={styles.profileContainer}>
        <div className={styles.profileArea}>
          <img src="/Default-pfp.png" alt="" className={styles.profilePic} />
          <div className={styles.username}>
            {user?.name || 'Username goes here.'}
          </div>
          <div className={styles.userEmail}>
            {user?.email}
          </div>
        </div>

        <div className={styles.contentArea}>
          <h3>Account Overview</h3>
          
          <div className={styles.accountInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Username:</span>
              <span className={styles.infoValue}>{user?.name || 'Not available'}</span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{user?.email || 'Not available'}</span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>User ID:</span>
              <span className={styles.infoValue}>{user?.id || 'Not available'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;