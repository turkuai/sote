import React, { useEffect, useState } from 'react';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: number;
    role_type: 'nurse' | 'manager' | 'admin';
    groups: Group[];
}

interface Group {
    id: number;
    name: string;
}

// Role mapping with colors
const ROLE_COLORS: Record<string, { bg: string; color: string; description: string }> = {
    'nurse': {
        bg: '#3498db',
        color: '#ffffff',
        description: 'Nurse - Read-only access'
    },
    'manager': {
        bg: '#f39c12',
        color: '#ffffff',
        description: 'Manager - Can manage nurses and create groups'
    },
    'admin': {
        bg: '#e74c3c',
        color: '#ffffff',
        description: 'Admin - Full system access'
    }
};

// Function to get role display name
const getRoleDisplayName = (roleType: string): string => {
    return roleType.charAt(0).toUpperCase() + roleType.slice(1);
};

// Function to get role color
const getRoleColor = (roleType: string) => {
    return ROLE_COLORS[roleType] || ROLE_COLORS['nurse'];
};

export default function Test() {
    const [users, setUsers] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const usersResponse = await fetch('/api/users');
                const groupsResponse = await fetch('/api/groups');

                if (!usersResponse.ok || !groupsResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const usersData = await usersResponse.json();
                const groupsData = await groupsResponse.json();

                // Handle the response structure: { success: true, data: [...] }
                setUsers(usersData.data || []);
                setGroups(groupsData.data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '2rem', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>Loading data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '2rem', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ backgroundColor: '#e74c3c', color: '#ffffff', padding: '1rem', borderRadius: '8px' }}>
                        <p style={{ marginBottom: '0' }}>Error: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h1 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Users & Groups Management</h1>
                    <p style={{ color: '#7f8c8d', marginBottom: '0' }}>View all users, groups, and their relationships</p>
                </div>

                {/* Main Content */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    {/* Groups Section */}
                    <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Groups ({groups.length})</h2>
                        {groups.length === 0 ? (
                            <p style={{ color: '#7f8c8d' }}>No groups found</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {groups.map((group) => (
                                    <div
                                        key={group.id}
                                        style={{
                                            backgroundColor: '#ecf0f1',
                                            padding: '1rem',
                                            borderRadius: '6px',
                                            borderLeft: '4px solid #3498db'
                                        }}
                                    >
                                        <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem', marginTop: '0' }}>{group.name}</h3>
                                        <p style={{ color: '#7f8c8d', marginBottom: '0', fontSize: '0.9rem' }}>ID: {group.id}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Users Section */}
                    <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Users ({users.length})</h2>
                        {users.length === 0 ? (
                            <p style={{ color: '#7f8c8d' }}>No users found</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        style={{
                                            backgroundColor: '#ecf0f1',
                                            padding: '1rem',
                                            borderRadius: '6px',
                                            borderLeft: '4px solid #2ecc71'
                                        }}
                                    >
                                        <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem', marginTop: '0' }}>
                                            {user.first_name} {user.last_name}
                                        </h3>
                                        <p style={{ color: '#7f8c8d', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{user.email}</p>
                                        
                                        {/* Role Section */}
                                        <div style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                                            <p style={{ color: '#34495e', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Role:</p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {user.role_type ? (
                                                    <span
                                                        title={getRoleColor(user.role_type).description}
                                                        style={{
                                                            backgroundColor: getRoleColor(user.role_type).bg,
                                                            color: getRoleColor(user.role_type).color,
                                                            padding: '0.4rem 0.8rem',
                                                            borderRadius: '4px',
                                                            fontSize: '0.9rem',
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        {getRoleDisplayName(user.role_type)}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#e74c3c', fontSize: '0.85rem' }}>No role assigned</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Groups Section */}
                                        <div style={{ marginTop: '0.75rem' }}>
                                            {user.groups && user.groups.length > 0 ? (
                                                <div>
                                                    <p style={{ color: '#34495e', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Groups:</p>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                        {user.groups.map((group) => (
                                                            <span
                                                                key={group.id}
                                                                style={{
                                                                    backgroundColor: '#3498db',
                                                                    color: '#ffffff',
                                                                    padding: '0.3rem 0.7rem',
                                                                    borderRadius: '4px',
                                                                    fontSize: '0.8rem'
                                                                }}
                                                            >
                                                                {group.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '0' }}>No groups assigned</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Detailed Relationships Section */}
                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem', fontSize: '1.3rem' }}>User-Group Relationships</h2>
                    {users.length === 0 ? (
                        <p style={{ color: '#7f8c8d' }}>No users found</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #3498db' }}>
                                        <th style={{ textAlign: 'left', padding: '0.75rem', color: '#2c3e50', fontWeight: 'bold' }}>Name</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem', color: '#2c3e50', fontWeight: 'bold' }}>Last Name</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem', color: '#2c3e50', fontWeight: 'bold' }}>Email</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem', color: '#2c3e50', fontWeight: 'bold' }}>Role</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem', color: '#2c3e50', fontWeight: 'bold' }}>Groups</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} style={{ borderBottom: '1px solid #bdc3c7' }}>
                                            <td style={{ padding: '0.75rem', color: '#2c3e50' }}>{user.first_name}</td>
                                            <td style={{ padding: '0.75rem', color: '#2c3e50' }}>{user.last_name}</td>
                                            <td style={{ padding: '0.75rem', color: '#7f8c8d' }}>{user.email}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span
                                                    style={{
                                                        backgroundColor: getRoleColor(user.role_type).bg,
                                                        color: getRoleColor(user.role_type).color,
                                                        padding: '0.3rem 0.7rem',
                                                        borderRadius: '4px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    {getRoleDisplayName(user.role_type)}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem', color: '#2c3e50' }}>
                                                {user.groups && user.groups.length > 0
                                                    ? user.groups.map((g) => g.name).join(', ')
                                                    : 'No groups assigned'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
