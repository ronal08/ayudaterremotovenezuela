import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';

export default function Index({ people, stats, filters, flash }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const isFirstMount = useRef(true);

    // Formatear fecha de forma amigable
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-VE', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Debounce para búsqueda en tiempo real
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                '/',
                { search, status },
                { preserveState: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleFilterStatus = (newStatus) => {
        setStatus(newStatus);
        router.get(
            '/',
            { search, status: newStatus },
            { preserveState: true, replace: true }
        );
    };

    // Obtener iniciales de la persona
    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <MainLayout stats={stats}>
            <Head title="Directorio de Búsqueda" />

            {/* Alerta Flash de Éxito */}
            {flash && flash.success && (
                <div className="alert alert-success" style={{ maxWidth: '1200px', margin: '0 auto 1.5rem auto' }}>
                    {flash.success}
                </div>
            )}

            {/* Barra de Filtros y Buscador */}
            <div className="toolbar-section">
                <div className="filter-chips">
                    <button
                        onClick={() => handleFilterStatus('')}
                        className={`chip ${status === '' ? 'active' : ''}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => handleFilterStatus('missing')}
                        className={`chip ${status === 'missing' ? 'active' : ''}`}
                    >
                        <span className="chip-dot danger"></span>
                        Sin Contacto
                    </button>
                    <button
                        onClick={() => handleFilterStatus('found')}
                        className={`chip ${status === 'found' ? 'active' : ''}`}
                    >
                        <span className="chip-dot success"></span>
                        Localizados
                    </button>
                </div>

                <div className="search-box">
                    <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, apellido o ubicación..."
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Rejilla de Reportes */}
            <div className="people-grid">
                {people.length > 0 ? (
                    people.map((person) => (
                        <Link
                            key={person.id}
                            href={`/persona/${person.id}`}
                            className="person-card"
                        >
                            {/* Imagen o Iniciales */}
                            <div className="card-image-wrapper">
                                {person.photo_url ? (
                                    <img
                                        src={person.photo_url}
                                        alt={person.full_name}
                                        className="card-image"
                                    />
                                ) : (
                                    <div className="placeholder-avatar">
                                        <div className="placeholder-avatar-initials">
                                            {getInitials(person.first_name, person.last_name)}
                                        </div>
                                    </div>
                                )}

                                {/* Badge de Estado */}
                                <span className={`badge ${person.status === 'found' ? 'badge-found' : 'badge-missing'}`}>
                                    {person.status === 'found' ? 'Localizado' : 'Sin Contacto'}
                                </span>
                            </div>

                            {/* Contenido */}
                            <div className="card-content">
                                <h3 className="card-name">
                                    {person.full_name}
                                </h3>

                                <div className="card-meta-item">
                                    <span>Edad:</span>
                                    <strong>{person.age ? `${person.age} años` : 'No especificada'}</strong>
                                </div>

                                <div className="card-meta-item" style={{ marginTop: '0.25rem' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px', color: '#64748b' }}>
                                        <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <span>Último contacto en:</span>
                                    <strong style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
                                        {person.last_seen_location}
                                    </strong>
                                </div>

                                <div className="card-meta-item">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px', color: '#64748b' }}>
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    <span>Fecha:</span>
                                    <strong>{formatDate(person.last_seen_at)}</strong>
                                </div>

                                {person.is_verified && (
                                    <div style={{ marginTop: '0.75rem' }}>
                                        <span className="badge-verified">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '2px' }}>
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                                            </svg>
                                            Verificado por autoridades
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Footer de Tarjeta */}
                            <div className="card-footer">
                                <span className="card-link">Ver detalles</span>
                                <span className="comment-count-badge">
                                    {person.comments?.length || 0} pistas
                                </span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No se encontraron reportes</h4>
                        <p style={{ color: 'var(--text-secondary)' }}>Intenta ajustar los términos de búsqueda o los filtros de estado.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
