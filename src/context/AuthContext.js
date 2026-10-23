import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Sample pre-configured demo accounts for grading and testing
export const DEMO_ACCOUNTS = {
  customer: {
    id: 'cust-1',
    fullName: 'Priya Sharma',
    email: 'customer@grocery.com',
    phone: '9876543210',
    password: 'customer123',
    role: 'Customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  admin: {
    id: 'admin-1',
    fullName: 'Arun Kumar',
    email: 'admin@grocery.com',
    phone: '9876512345',
    password: 'admin123',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  },
};

export const AuthProvider = ({ children }) => {
  // App initialization state for splash screen
  const [isInitializing, setIsInitializing] = useState(true);

  // Authenticated active session user
  const [user, setUser] = useState(null);

  // Post-login splash transition state ('Customer' | 'Admin' | null)
  const [splashRole, setSplashRole] = useState(null);

  // Registered accounts database (initialized with demo accounts)
  const [accounts, setAccounts] = useState([
    DEMO_ACCOUNTS.customer,
    DEMO_ACCOUNTS.admin,
  ]);

  // Validation helpers
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const cleanPhone = String(phone).replace(/\D/g, '');
    return cleanPhone.length >= 10;
  };

  // Called when initial app splash completes
  const completeInitialization = () => {
    setIsInitializing(false);
  };

  // Called when post-login splash animation finishes (~1.5s)
  const dismissSplash = () => {
    setSplashRole(null);
  };

  // Sign in handler
  // Rule: Never determine user's role from a manually selected UI label alone;
  // use the role of the authenticated account.
  const signIn = ({ email, password }) => {
    const trimmedEmail = email ? email.trim() : '';

    if (!trimmedEmail) {
      return { success: false, error: 'Email address is required.' };
    }
    if (!validateEmail(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Lookup account in registered accounts
    const existingAccount = accounts.find(
      (acc) => acc.email.toLowerCase() === trimmedEmail.toLowerCase()
    );

    if (!existingAccount) {
      return {
        success: false,
        error: 'No account registered with this email. Please Sign Up first.',
      };
    }

    if (existingAccount.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials.',
      };
    }

    // Role is determined strictly from the authenticated account record
    const authenticatedUser = {
      ...existingAccount,
    };

    setUser(authenticatedUser);
    setSplashRole(authenticatedUser.role);

    return {
      success: true,
      user: authenticatedUser,
    };
  };

  // Public Sign Up handler
  // Rule: Public Sign Up creates Customer accounts ONLY.
  const signUp = ({ fullName, email, phone, password, confirmPassword }) => {
    const trimmedName = fullName ? fullName.trim() : '';
    const trimmedEmail = email ? email.trim() : '';
    const cleanPhone = phone ? phone.trim() : '';

    if (!trimmedName) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!trimmedEmail) {
      return { success: false, error: 'Email address is required.' };
    }
    if (!validateEmail(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPhone) {
      return { success: false, error: 'Phone number is required.' };
    }
    if (!validatePhone(cleanPhone)) {
      return { success: false, error: 'Phone number must contain at least 10 digits.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }

    // Check for duplicate email
    const duplicate = accounts.find(
      (acc) => acc.email.toLowerCase() === trimmedEmail.toLowerCase()
    );
    if (duplicate) {
      return {
        success: false,
        error: 'An account with this email already exists. Please Sign In.',
      };
    }

    // Public registration always enforces Customer role
    const newCustomer = {
      id: `cust-${Date.now().toString().slice(-6)}`,
      fullName: trimmedName,
      email: trimmedEmail,
      phone: cleanPhone,
      password: password,
      role: 'Customer', // Public signup is strictly Customer
      avatar: DEMO_ACCOUNTS.customer.avatar,
    };

    setAccounts((prev) => [...prev, newCustomer]);
    setUser(newCustomer);
    setSplashRole('Customer');

    return { success: true, user: newCustomer };
  };

  // Admin Account Creation handler (Restricted to authenticated Admins)
  // Rule: Existing Admins can create additional Admin accounts from the protected Admin page.
  const createAdminAccount = ({ fullName, email, phone, password, confirmPassword }) => {
    if (user?.role !== 'Admin') {
      return {
        success: false,
        error: 'Only authenticated Admins are authorized to create new Admin accounts.',
      };
    }

    const trimmedName = fullName ? fullName.trim() : '';
    const trimmedEmail = email ? email.trim() : '';
    const cleanPhone = phone ? phone.trim() : '';

    if (!trimmedName) {
      return { success: false, error: 'Admin full name is required.' };
    }
    if (!trimmedEmail) {
      return { success: false, error: 'Admin email address is required.' };
    }
    if (!validateEmail(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPhone || !validatePhone(cleanPhone)) {
      return { success: false, error: 'Valid 10-digit phone number is required.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }

    // Check email collision
    const duplicate = accounts.find(
      (acc) => acc.email.toLowerCase() === trimmedEmail.toLowerCase()
    );
    if (duplicate) {
      return {
        success: false,
        error: 'An account with this email address already exists.',
      };
    }

    const newAdmin = {
      id: `admin-${Date.now().toString().slice(-6)}`,
      fullName: trimmedName,
      email: trimmedEmail,
      phone: cleanPhone,
      password: password,
      role: 'Admin',
      avatar: DEMO_ACCOUNTS.admin.avatar,
    };

    setAccounts((prev) => [...prev, newAdmin]);
    return { success: true, user: newAdmin };
  };

  // Edit profile handler
  const updateProfile = ({ fullName, email, phone }) => {
    const trimmedName = fullName ? fullName.trim() : '';
    const trimmedEmail = email ? email.trim() : '';
    const cleanPhone = phone ? phone.trim() : '';

    if (!trimmedName) {
      return { success: false, error: 'Full name cannot be empty.' };
    }
    if (!trimmedEmail) {
      return { success: false, error: 'Email cannot be empty.' };
    }
    if (!validateEmail(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPhone || !validatePhone(cleanPhone)) {
      return { success: false, error: 'Phone number must be at least 10 digits.' };
    }

    setUser((prev) => ({
      ...prev,
      fullName: trimmedName,
      email: trimmedEmail,
      phone: cleanPhone,
    }));

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === user?.id
          ? { ...acc, fullName: trimmedName, email: trimmedEmail, phone: cleanPhone }
          : acc
      )
    );

    return { success: true };
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setSplashRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'Admin',
        isCustomer: user?.role === 'Customer',
        isInitializing,
        completeInitialization,
        splashRole,
        dismissSplash,
        accounts,
        signIn,
        signUp,
        createAdminAccount,
        updateProfile,
        logout,
        validateEmail,
        validatePhone,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
