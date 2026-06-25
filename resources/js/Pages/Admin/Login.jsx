import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ flash }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#0f172a',
            padding: '1rem'
        }}>
            <Head title="Acceso de Administrador" />

            {/* Barra Tricolor */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '6px',
                display: 'flex',
                zIndex: 1000
            }}>
                <div style={{ backgroundColor: '#fbc02d', flex: 1 }}></div>
                <div style={{ backgroundColor: '#1565c0', flex: 1 }}></div>
                <div style={{ backgroundColor: '#d32f2f', flex: 1 }}></div>
            </div>

            <div style={{
                maxWidth: '420px',
                width: '100%',
                background: 'white',
                padding: '2.5rem',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                        Panel de Control
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        Plataforma de Búsqueda y Coordinación
                    </p>
                </div>

                {/* Alertas */}
                {flash && flash.success && (
                    <div className="alert alert-success">{flash.success}</div>
                )}
                {flash && flash.error && (
                    <div className="alert alert-danger">{flash.error}</div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="admin@ayudaterremotovenezuela.com"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            required
                        />
                        {errors.email && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            required
                        />
                        {errors.password && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.password}</span>}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
                        disabled={processing}
                    >
                        {processing ? 'Iniciando Sesión...' : 'Ingresar al Panel'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <Link href="/" style={{ fontSize: '0.875rem', color: '#64748b', textDecoration: 'none' }}>
                        Volver a la web pública
                    </Link>
                </div>
            </div>
        </div>
    );
}
