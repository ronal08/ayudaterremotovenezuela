import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';

export default function Show({ person, flash }) {
    const [showModal, setShowModal] = useState(false);
    const [pin, setPin] = useState('');
    const [newStatus, setNewStatus] = useState(person.status);
    
    // Formulario de comentarios
    const [authorName, setAuthorName] = useState('');
    const [authorPhone, setAuthorPhone] = useState('');
    const [commentContent, setCommentContent] = useState('');

    // Errores
    const [errors, setErrors] = useState({});

    // Formatear fechas
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

    // Iniciales
    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    // Enviar comentario
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        
        router.post(`/persona/${person.id}/comentar`, {
            author_name: authorName,
            author_phone: authorPhone,
            content: commentContent
        }, {
            onSuccess: () => {
                setAuthorName('');
                setAuthorPhone('');
                setCommentContent('');
                setErrors({});
            },
            onError: (errs) => {
                setErrors(errs);
            }
        });
    };

    // Actualizar estado (PIN)
    const handleStatusUpdateSubmit = (e) => {
        e.preventDefault();
        
        router.post(`/persona/${person.id}/estado`, {
            pin: pin,
            status: newStatus
        }, {
            onSuccess: () => {
                setShowModal(false);
                setPin('');
                setErrors({});
            },
            onError: (errs) => {
                setErrors(errs);
            }
        });
    };

    return (
        <MainLayout>
            <Head title={`Búsqueda: ${person.full_name}`} />

            <div style={{ maxWidth: '1000px', margin: '0 auto 1.5rem auto' }}>
                <Link href="/" className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Volver al listado
                </Link>

                {/* Alertas Flash */}
                {flash && flash.success && (
                    <div className="alert alert-success">{flash.success}</div>
                )}
                {flash && flash.error && (
                    <div className="alert alert-danger">{flash.error}</div>
                )}
            </div>

            <div className="profile-container">
                {/* Columna Izquierda (Foto y Estado) */}
                <div className="profile-sidebar">
                    <div className="profile-card-image">
                        {person.photo_url ? (
                            <img
                                src={person.photo_url}
                                alt={person.full_name}
                                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '450px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div className="placeholder-avatar" style={{ height: '300px' }}>
                                <div className="placeholder-avatar-initials">
                                    {getInitials(person.first_name, person.last_name)}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botón de Cambiar Estado */}
                    <button
                        onClick={() => {
                            setNewStatus(person.status === 'missing' ? 'found' : 'missing');
                            setShowModal(true);
                        }}
                        className={`btn ${person.status === 'missing' ? 'btn-primary' : 'btn-outline-danger'}`}
                        style={{ width: '100%' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        {person.status === 'missing' ? 'Reportar como Localizado' : 'Marcar como Desaparecido'}
                    </button>

                    {/* Datos del Reportante */}
                    <div className="profile-reporter-info">
                        <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                            Datos del Reporte Original
                        </h4>
                        
                        {person.show_reporter_info ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Reportado por:</span>
                                    <strong>{person.reporter_name} ({person.reporter_relationship})</strong>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Teléfono de contacto:</span>
                                    <strong><a href={`tel:${person.reporter_phone}`} style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>{person.reporter_phone}</a></strong>
                                </div>
                                {person.reporter_email && (
                                    <div>
                                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Correo electrónico:</span>
                                        <strong>{person.reporter_email}</strong>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                🔒 Los datos de contacto del familiar/reportante son privados por motivos de seguridad. Si posees información verídica, deja una pista en el hilo de comentarios para que sea moderada.
                            </p>
                        )}
                    </div>
                </div>

                {/* Columna Derecha (Ficha y Comentarios) */}
                <div className="profile-main-content">
                    
                    {/* Ficha de Detalles */}
                    <div className="profile-details-box">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: '800', lineHeight: '1.1' }}>{person.full_name}</h2>
                                {person.is_verified && (
                                    <span className="badge-verified" style={{ marginTop: '0.5rem', display: 'inline-flex' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '2px' }}>
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                                        </svg>
                                        Reporte verificado por autoridades
                                    </span>
                                )}
                            </div>
                            <span className={`badge ${person.status === 'found' ? 'badge-found' : 'badge-missing'}`} style={{ position: 'static' }}>
                                {person.status === 'found' ? 'Localizado a salvo' : 'Sin Contacto'}
                            </span>
                        </div>

                        <div className="details-grid">
                            <div className="detail-item">
                                <label>Edad</label>
                                <span>{person.age ? `${person.age} años` : 'No especificada'}</span>
                            </div>
                            <div className="detail-item">
                                <label>Género</label>
                                <span>{person.gender || 'No especificado'}</span>
                            </div>
                            <div className="detail-item">
                                <label>Último lugar visto</label>
                                <span>{person.last_seen_location}</span>
                            </div>
                            <div className="detail-item">
                                <label>Fecha y hora de último contacto</label>
                                <span>{formatDate(person.last_seen_at)}</span>
                            </div>
                        </div>

                        <div className="detail-item" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                            <label>Señas Particulares y Vestimenta</label>
                            <span style={{ whiteSpace: 'pre-line', fontWeight: 'normal', color: 'var(--text-secondary)', lineHeight: '1.6', marginTop: '0.5rem' }}>
                                {person.distinctive_features || 'No se detallaron señas particulares.'}
                            </span>
                        </div>
                    </div>

                    {/* Hilo de Pistas y Comentarios */}
                    <div className="comments-section">
                        <h3 className="section-title">Pistas de Localización y Avances ({person.comments?.length || 0})</h3>

                        {/* Formulario para agregar pista */}
                        <form onSubmit={handleCommentSubmit} className="comment-form">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label htmlFor="author_name">Tu Nombre y Apellido *</label>
                                    <input
                                        type="text"
                                        id="author_name"
                                        className="form-control"
                                        placeholder="Ej. Juan Pérez"
                                        value={authorName}
                                        onChange={(e) => setAuthorName(e.target.value)}
                                        required
                                    />
                                    {errors.author_name && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.author_name}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="author_phone">Tu Teléfono (No será público) *</label>
                                    <input
                                        type="tel"
                                        id="author_phone"
                                        className="form-control"
                                        placeholder="Ej. 0414-1234567"
                                        value={authorPhone}
                                        onChange={(e) => setAuthorPhone(e.target.value)}
                                        required
                                    />
                                    {errors.author_phone && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.author_phone}</span>}
                                </div>
                            </div>
                            <div className="form-group">
                                    <label htmlFor="content">¿Tienes alguna pista sobre esta persona? Escríbela aquí *</label>
                                    <textarea
                                        id="content"
                                        className="form-control"
                                        placeholder="Indica si la viste, dónde, fecha y hora aproximada, o si sabes en qué albergue está..."
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        required
                                    ></textarea>
                                    {errors.content && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.content}</span>}
                            </div>
                            <button type="submit" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
                                Publicar Pista de Ayuda
                            </button>
                        </form>

                        {/* Listado de pistas */}
                        <div className="comments-list">
                            {person.comments && person.comments.length > 0 ? (
                                person.comments.map((comment) => (
                                    <div key={comment.id} className="comment-card">
                                        <div className="comment-header">
                                            <span className="comment-author">{comment.author_name}</span>
                                            <span className="comment-date">{formatDate(comment.created_at)}</span>
                                        </div>
                                        <p className="comment-content">{comment.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                                    No hay pistas de búsqueda publicadas aún. Si sabes algo, por favor repórtalo en el formulario de arriba.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de PIN de Seguridad */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Actualizar Estado del Reporte</h3>
                            <button className="modal-close" onClick={() => { setShowModal(false); setPin(''); setErrors({}); }}>&times;</button>
                        </div>
                        <form onSubmit={handleStatusUpdateSubmit}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                                Para cambiar el estado del reporte a <strong>{newStatus === 'found' ? 'Localizado a salvo' : 'Sin contacto'}</strong>, debes ingresar el PIN de seguridad de 4 números que definiste al registrar a esta persona.
                            </p>
                            
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label htmlFor="new_status">Nuevo Estado</label>
                                <select
                                    id="new_status"
                                    className="form-control"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <option value="missing">Sin Contacto (Desaparecido)</option>
                                    <option value="found">Localizado a Salvo</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="security_pin_input">PIN de Seguridad (4 dígitos)</label>
                                <input
                                    type="password"
                                    maxLength="4"
                                    pattern="\d{4}"
                                    id="security_pin_input"
                                    className="form-control"
                                    placeholder="Ej. 1234"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                    required
                                    style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.25rem' }}
                                />
                                {errors.pin && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.pin}</span>}
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => { setShowModal(false); setPin(''); setErrors({}); }}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Confirmar Cambio
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
