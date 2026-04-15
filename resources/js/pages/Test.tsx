import React from 'react';
import { useState } from 'react';

export default function Test() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState('');
    const [todos, setTodos] = useState<string[]>([]);
    const [todoInput, setTodoInput] = useState('');

    const incrementCount = () => setCount(count + 1);
    const decrementCount = () => setCount(count - 1);
    const resetCount = () => setCount(0);

    const addTodo = () => {
        if (todoInput.trim()) {
            setTodos([...todos, todoInput]);
            setTodoInput('');
        }
    };

    const removeTodo = (index: number) => {
        setTodos(todos.filter((_, i) => i !== index));
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f5f5f5', color: '#000000' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h1 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>🚀 React + Laravel Demo</h1>
                    <p style={{ color: '#7f8c8d', marginBottom: '0' }}>Interactive component with state management</p>
                </div>

                {/* Counter Section */}
                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem', fontSize: '1.5rem' }}>📊 Counter</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3498db', minWidth: '100px', textAlign: 'center' }}>
                            {count}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={decrementCount}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#e74c3c',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                ➖ Decrease
                            </button>
                            <button
                                onClick={incrementCount}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#2ecc71',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                ➕ Increase
                            </button>
                            <button
                                onClick={resetCount}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#95a5a6',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                🔄 Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Name Input Section */}
                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem', fontSize: '1.5rem' }}>👤 Welcome Message</h2>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '1rem',
                            border: '2px solid #ecf0f1',
                            borderRadius: '4px',
                            marginBottom: '1rem',
                            boxSizing: 'border-box'
                        }}
                    />
                    {name && (
                        <div style={{ padding: '1rem', backgroundColor: '#e8f8f5', border: '1px solid #2ecc71', borderRadius: '4px', color: '#27ae60' }}>
                            ✨ Welcome, {name}!
                        </div>
                    )}
                </div>

                {/* Todo List Section */}
                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem', fontSize: '1.5rem' }}>✅ Todo List</h2>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <input
                            type="text"
                            value={todoInput}
                            onChange={(e) => setTodoInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                            placeholder="Add a new todo..."
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                fontSize: '1rem',
                                border: '2px solid #ecf0f1',
                                borderRadius: '4px',
                                boxSizing: 'border-box'
                            }}
                        />
                        <button
                            onClick={addTodo}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#3498db',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Add
                        </button>
                    </div>
                    {todos.length > 0 && (
                        <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                            {todos.map((todo, index) => (
                                <li
                                    key={index}
                                    style={{
                                        padding: '1rem',
                                        backgroundColor: '#f8f9fa',
                                        border: '1px solid #ecf0f1',
                                        borderRadius: '4px',
                                        marginBottom: '0.5rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span>• {todo}</span>
                                    <button
                                        onClick={() => removeTodo(index)}
                                        style={{
                                            backgroundColor: '#e74c3c',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '0.5rem 1rem',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    {todos.length === 0 && !todoInput && (
                        <p style={{ color: '#95a5a6', fontStyle: 'italic' }}>No todos yet. Add one above!</p>
                    )}
                </div>

                {/* Tech Stack Info */}
                <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#2c3e50', marginBottom: '1rem', fontSize: '1.5rem' }}>🛠️ Tech Stack</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ padding: '1rem', backgroundColor: '#ebf5fb', borderRadius: '4px' }}>
                            <strong style={{ color: '#2874a6' }}>Backend:</strong>
                            <p style={{ margin: '0.5rem 0 0 0', color: '#555555' }}>Laravel with PHP</p>
                        </div>
                        <div style={{ padding: '1rem', backgroundColor: '#fef5e7', borderRadius: '4px' }}>
                            <strong style={{ color: '#c27d0e' }}>Frontend:</strong>
                            <p style={{ margin: '0.5rem 0 0 0', color: '#555555' }}>React with TypeScript</p>
                        </div>
                        <div style={{ padding: '1rem', backgroundColor: '#f4ecf7', borderRadius: '4px' }}>
                            <strong style={{ color: '#6c3483' }}>Bridge:</strong>
                            <p style={{ margin: '0.5rem 0 0 0', color: '#555555' }}>Inertia.js</p>
                        </div>
                        <div style={{ padding: '1rem', backgroundColor: '#eafaf1', borderRadius: '4px' }}>
                            <strong style={{ color: '#186a3b' }}>Build Tool:</strong>
                            <p style={{ margin: '0.5rem 0 0 0', color: '#555555' }}>Vite</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

