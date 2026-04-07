/**
 * Reusable React Components Library
 * Base components for common UI patterns
 */

import React, { CSSProperties } from 'react';

// ============ Card Component ============
interface CardProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    style?: CSSProperties;
}

export const Card: React.FC<CardProps> = ({ title, description, children, style }) => {
    const defaultStyle: CSSProperties = {
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        ...style,
    };

    return (
        <div style={defaultStyle}>
            {title && <h2 style={{ color: '#2c3e50', marginBottom: '0.5rem', marginTop: 0 }}>{title}</h2>}
            {description && <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>{description}</p>}
            {children}
        </div>
    );
};

// ============ Table Component ============
interface Column<T> {
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyField?: keyof T;
    onRowClick?: (row: T) => void;
}

export const Table = <T extends Record<string, any>>({
    data,
    columns,
    keyField = 'id' as keyof T,
    onRowClick,
}: TableProps<T>) => {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #3498db' }}>
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                style={{
                                    textAlign: 'left',
                                    padding: '0.75rem',
                                    color: '#2c3e50',
                                    fontWeight: 'bold',
                                }}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr
                            key={String(row[keyField])}
                            onClick={() => onRowClick?.(row)}
                            style={{
                                borderBottom: '1px solid #bdc3c7',
                                cursor: onRowClick ? 'pointer' : 'auto',
                            }}
                        >
                            {columns.map((col) => (
                                <td
                                    key={String(col.key)}
                                    style={{
                                        padding: '0.75rem',
                                        color: '#2c3e50',
                                    }}
                                >
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ============ Button Component ============
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'success' | 'danger' | 'secondary';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, style, ...props }) => {
    const variantStyles: Record<string, CSSProperties> = {
        primary: { backgroundColor: '#3498db', color: '#ffffff' },
        success: { backgroundColor: '#2ecc71', color: '#ffffff' },
        danger: { backgroundColor: '#e74c3c', color: '#ffffff' },
        secondary: { backgroundColor: '#95a5a6', color: '#ffffff' },
    };

    const buttonStyle: CSSProperties = {
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        ...variantStyles[variant],
        ...style,
    };

    return (
        <button style={buttonStyle} {...props}>
            {children}
        </button>
    );
};

// ============ Alert Component ============
interface AlertProps {
    variant: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ variant, message, onClose }) => {
    const variantStyles: Record<string, { bg: string; color: string; border: string }> = {
        success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
        error: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
        warning: { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' },
        info: { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' },
    };

    const style = variantStyles[variant];

    return (
        <div
            style={{
                backgroundColor: style.bg,
                color: style.color,
                padding: '1rem',
                borderRadius: '4px',
                border: `1px solid ${style.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
            }}
        >
            <span>{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: style.color,
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                    }}
                >
                    ×
                </button>
            )}
        </div>
    );
};

// ============ Loading Spinner ============
export const Loading: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>{message}</p>
        </div>
    );
};
