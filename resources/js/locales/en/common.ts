const enCommon = {
    common: {
        language: 'Language',
        english: 'English',
        finnish: 'Finnish',
        swedish: 'Swedish',
        loading: 'Loading...',
        navigation: 'Navigation',
        close: 'Close',
    },

  nav: {
    dashboard: 'Dashboard',
    patients: 'Patients',
    repository: 'Repository',
    documentation: 'Documentation',
    navigationMenu: 'Navigation Menu',
  },

  auth: {
    login: 'Log in',
    register: 'Register',
    verifyEmail: 'Verify email',
    pleaseLoginToContinue: 'Please login to continue',
    email: 'Email',
    password: 'Password',
    enterYourEmail: 'Enter your email',
    rememberMe: 'Remember me',
    signIn: 'Sign in',
    signingIn: 'Signing in...',
    unexpectedError: 'An unexpected error occurred',
    useCredentialsFromDatabase: 'Use credentials from your database',
    loginWithDatabaseUser: 'Login with any username/password from the users table',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
  },

  user: {
    welcome: 'Welcome',
    settings: 'Settings',
    logout: 'Logout',
    myDashboard: 'My Dashboard',
  },

  tabs: {
    users: 'Users',
    groups: 'Groups',
    waitingList: 'Waiting List',
    settings: 'Settings',
  },

  welcome: {
    title: 'Welcome',
    heading: "Let's get started",
    introLine1: 'Laravel has an incredibly rich ecosystem.',
    introLine2: 'We suggest you start with the following.',
    readThe: 'Read the',
    documentation: 'Documentation',
    watchTutorials: 'Watch video tutorials at',
    laracasts: 'Laracasts',
    deployNow: 'Deploy now',
  },

  users: {
    managementTitle: 'Users Management',
    searchPlaceholder: 'Search users...',
    waitingList: 'Waiting list',
    roles: {
      nurse: 'Nurse (Read-only)',
      manager: 'Manager (CRUD)',
      admin: 'Admin (Full Access)',
    },
    form: {
      firstName: 'First name *',
      lastName: 'Last name *',
      email: 'Email *',
      role: 'Role',
      passwordOptional: 'Password (optional)',
      confirmPasswordOptional: 'Confirm password (optional)',
      password: 'Password',
      confirmPassword: 'Confirm password',
      passwordHint: 'Leave Password and Confirm password empty to keep the current password.',
      newPasswordPlaceholder: 'New password (optional)',
      confirmNewPasswordPlaceholder: 'Confirm new password',
    },
    errors: {
      fillBothPasswordFields: 'To change the password, fill both password fields.',
      passwordsDoNotMatch: 'Passwords do not match',
      notAllowedToChangePassword: 'You are not allowed to change this password.',
      fillBothOrLeaveEmpty: 'Please fill both password fields or leave both empty',
    },
  },

  grid: {
    loading: 'Loading...',
    add: 'Add',
    success: {
      itemUpdated: 'Item updated successfully!',
    },
    errors: {
      updateFailed: 'Failed to update item',
      listViewRequiresProps: 'List view requires both renderItem and loadPage props.',
    },
    dialog: {
      edit: 'Edit',
      add: 'Add',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
    },
    confirmDelete: {
      title: 'Confirm deletion',
      message: 'Are you sure you want to remove this item?',
      delete: 'Delete',
      deleting: 'Deleting…',
      cancel: 'Cancel',
    },
    pagination: {
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of',
    },
  },

  table: {
    name: 'Name',
    email: 'Email',
    roleType: 'Role Type',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
  },

  groups: {
    managementTitle: 'Groups Management',
    searchPlaceholder: 'Search groups...',
    myGroups: 'My Groups',
    autoEnroll: 'Auto-enroll',
    noGroupsYet: "You don't belong to any group, yet...",
    joinGroup: 'Join a Group',
    hideKey: 'Hide key',
    showKey: 'Show key',
    table: {
      accessKey: 'Access Key',
      userCount: 'User Count',
    },
    errors: {
      nameRequired: 'Group name cannot be empty',
      accessKeyRequired: 'Access key cannot be empty',
    },
    form: {
      groupName: 'Group Name *',
      groupNamePlaceholder: 'e.g., Sector 1, Emergency Room, etc.',
      accessKey: 'Access Key *',
      accessKeyPlaceholder: 'Access key',
    },
    registration: {
      groupName: 'Group Name',
      groupNamePlaceholder: 'Enter the group name',
      secretKey: 'Secret Key',
      secretKeyPlaceholder: 'Enter the group secret key',
      invalidCredentials: 'Invalid group name or access key',
      connectionError: 'Connection error. Please try again.',
      registering: 'Registering...',
      register: 'Register',
    },
    usersModal: {
      users: 'Users',
      addUsers: 'Add Users',
      noUsersInGroup: 'No users in this group',
      removeUser: 'Remove user from group',
      selectUsersToAdd: 'Select users to add',
      error: 'Error:',
      totalUsers: 'Total users in system',
      usersInGroup: 'Users in this group',
      availableToAdd: 'Available to add',
      noUsersAvailable: 'No users available to add',
      addSelected_one: 'Add {{count}} User',
      addSelected_other: 'Add {{count}} Users',
    },
  },

  waitingList: {
    title: 'Waiting for Approval',
    description: 'Users pending approval. Click "Accept" to approve and assign as Nurse.',
    accept: 'Accept',
    table: {
      name: 'Name',
      lastName: 'Last Name',
    },
    notifications: {
      approved: '{{name}} has been approved and assigned as Nurse.',
      failed: 'Failed to approve user',
      error: 'Error approving user',
    },
  },

  settings: {
    header: {
      title: 'Settings',
      description: 'Manage your account settings and set e-mail preferences.',
    },
    tabs: {
      profile: 'Profile',
      groups: 'Groups',
    },
    mobile: {
      userDetails: 'User Details',
      changePassword: 'Change Password',
      account: 'Account',
    },
    profile: {
      title: 'Profile',
      description: 'This is how others will see you on the site.',
    },
    fields: {
      name: 'Name',
      username: 'Username',
      role: 'Role',
    },
    password: {
      current: 'Current Password',
      new: 'New Password',
      confirm: 'Confirm Password',
      confirmNew: 'Confirm new password',
      placeholders: {
        current: 'Enter current password',
        new: 'Enter new password',
        confirm: 'Re-enter new password',
        confirmDesktop: 'Confirm new password',
      },
      success: 'Password changed successfully!',
      errors: {
        fillAllFields: 'Please fill in all fields before submitting.',
        passwordMismatch: 'New password and confirmation do not match.',
        passwordTooShort: 'New password must be at least 6 characters long.',
        failed: 'Failed to change password',
        tryAgain: 'Failed to change password. Please try again.',
      },
    },
    actions: {
      updatePassword: 'Update Password',
      updateProfile: 'Update Profile',
    },
    groups: {
      title: 'My Groups',
      description: 'Groups you are currently registered in.',
      empty: 'You are not registered in any group.',
    },
  },
};

export default enCommon;
