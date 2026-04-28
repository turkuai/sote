const enCommon = {
    common: {
        language: 'Language',
        english: 'English',
        finnish: 'Finnish',
        loading: 'Loading...',
        navigation: 'Navigation',
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
};

export default enCommon;
