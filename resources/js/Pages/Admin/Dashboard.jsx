import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function Dashboard({ people, centers = [], volunteers = [], flash }) {
    const [activeTab, setActiveTab] = useState('people');
    const [editPerson, setEditPerson] = useState(null);
    const [viewCommentsPerson, setViewCommentsPerson] = useState(null);

    // Formulario de edición de personas
    const [editForm, setEditForm] = useState({
        first_name: '',
        last_name: '',
        age: '',
        gender: '',
        last_seen_location: '',
        distinctive_features: '',
        status: ''
    });

    // Formatear fechas
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-VE', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Logout
    const handleLogout = () => {
        router.post('/admin/logout');
    };

    // Alternar verificación de persona
    const handleVerifyToggle = (id) => {
        router.post(`/admin/persona/${id}/verificar`, {}, {
            preserveScroll: true
        });
    };

    // Eliminar persona
    const handleDeletePerson = (id, name) => {
        if (confirm(`¿Estás seguro de que deseas eliminar permanentemente el reporte de ${name}? Esta acción no se puede deshacer.`)) {
            router.delete(`/admin/persona/${id}`, {
                preserveScroll: true
            });
        }
    };

    // Eliminar comentario
    const handleDeleteComment = (commentId) => {
        if (confirm('¿Deseas eliminar permanentemente esta pista/comentario?')) {
            router.delete(`/admin/comentario/${commentId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    if (viewCommentsPerson) {
                        const updatedComments = viewCommentsPerson.comments.filter(c => c.id !== commentId);
                        setViewCommentsPerson({
                            ...viewCommentsPerson,
                            comments: updatedComments
                        });
                        
                        const idx = people.findIndex(p => p.id === viewCommentsPerson.id);
                        if (idx !== -1) {
                            people[idx].comments = updatedComments;
                        }
                    }
                }
            });
        }
    };

    // Alternar verificación de centro de acopio
    const handleVerifyCenter = (id) => {
        router.post(`/admin/centros/${id}/verificar`, {}, {
            preserveScroll: true
        });
    };

    // Eliminar centro de acopio
    const handleDeleteCenter = (id, name) => {
        if (confirm(`¿Estás seguro de que deseas eliminar el centro de acopio "${name}"?`)) {
            router.delete(`/admin/centros/${id}`, {
                preserveScroll: true
            });
        }
    };

    // Alternar verificación de voluntario
    const handleVerifyVolunteer = (id) => {
        router.post(`/admin/voluntarios/${id}/verificar`, {}, {
            preserveScroll: true
        });
    };

    // Eliminar voluntario
    const handleDeleteVolunteer = (id, name) => {
        if (confirm(`¿Estás seguro de que deseas eliminar al voluntario ${name}?`)) {
            router.delete(`/admin/voluntarios/${id}`, {
                preserveScroll: true
            });
        }
    };

    // Abrir Modal de Edición
    const openEditModal = (person) => {
        setEditPerson(person);
        setEditForm({
            first_name: person.first_name,
            last_name: person.last_name,
            age: person.age || '',
            gender: person.gender || '',
            last_seen_location: person.last_seen_location,
            distinctive_features: person.distinctive_features || '',
            status: person.status
        });
    };

    // Enviar Edición
    const handleEditSubmit = (e) => {
        e.preventDefault();
        router.put(`/admin/persona/${editPerson.id}`, editForm, {
            preserveScroll: true,
            onSuccess: () => {
                setEditPerson(null);
            }
        });
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <Head title="Panel de Moderación" />

            {/* Barra Tricolor */}
            <div style={{ height: '6px', display: 'flex', width: '100%' }}>
                <div style={{ backgroundColor: '#fbc02d', flex: 1 }}></div>
                <div style={{ backgroundColor: '#1565c0', flex: 1 }}></div>
                <div style={{ backgroundColor: '#d32f2f', flex: 1 }}></div>
            </div>

            {/* Header de Admin */}
            <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                            Panel de Moderación
                        </h1>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Iniciado sesión como: <strong>Administrador</strong>
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link href="/" className="btn btn-secondary">
                            Ver web pública
                        </Link>
                        <button onClick={handleLogout} className="btn btn-outline-danger">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenido Principal */}
            <div className="admin-container" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
                {/* Alertas */}
                {flash && flash.success && (
                    <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>{flash.success}</div>
                )}
                {flash && flash.error && (
                    <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>{flash.error}</div>
                )}

                {/* Selectores de Pestaña */}
                <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setActiveTab('people')}
                        className="btn"
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            background: activeTab === 'people' ? 'var(--ven-blue)' : 'white',
                            color: activeTab === 'people' ? 'white' : 'var(--text-secondary)',
                            fontWeight: '700',
                            border: '1px solid #e2e8f0',
                            borderBottom: 'none'
                        }}
                    >
                        Personas Desaparecidas ({people.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('centers')}
                        className="btn"
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            background: activeTab === 'centers' ? 'var(--ven-blue)' : 'white',
                            color: activeTab === 'centers' ? 'white' : 'var(--text-secondary)',
                            fontWeight: '700',
                            border: '1px solid #e2e8f0',
                            borderBottom: 'none'
                        }}
                    >
                        Centros de Acopio ({centers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('volunteers')}
                        className="btn"
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            background: activeTab === 'volunteers' ? 'var(--ven-blue)' : 'white',
                            color: activeTab === 'volunteers' ? 'white' : 'var(--text-secondary)',
                            fontWeight: '700',
                            border: '1px solid #e2e8f0',
                            borderBottom: 'none'
                        }}
                    >
                        Voluntarios de Transporte ({volunteers.length})
                    </button>
                </div>

                {/* RENDER SEGÚN PESTAÑA */}
                {activeTab === 'people' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Registros de Personas</h2>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Total en base de datos: <strong>{people.length} registros</strong>
                            </span>
                        </div>

                        <div className="admin-table-card">
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre Completo</th>
                                            <th>Último Contacto</th>
                                            <th>Estado</th>
                                            <th>Reportante</th>
                                            <th>Verificado</th>
                                            <th>Comentarios</th>
                                            <th style={{ textAlign: 'right' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {people.length > 0 ? (
                                            people.map((person) => (
                                                <tr key={person.id}>
                                                    <td><strong>#{person.id}</strong></td>
                                                    <td>
                                                        <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                                                            {person.full_name}
                                                        </div>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                            {person.age ? `${person.age} años` : 'Edad no especificada'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: '500' }}>{person.last_seen_location}</div>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                            {formatDate(person.last_seen_at)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${person.status === 'found' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                                                            {person.status === 'found' ? 'Localizado' : 'Sin Contacto'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div>{person.reporter_name} ({person.reporter_relationship})</div>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                            {person.reporter_phone}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleVerifyToggle(person.id)}
                                                            className="btn"
                                                            style={{
                                                                padding: '4px 8px',
                                                                fontSize: '0.75rem',
                                                                background: person.is_verified ? '#dcfce7' : '#f1f5f9',
                                                                color: person.is_verified ? '#15803d' : '#475569',
                                                                borderRadius: '4px',
                                                                fontWeight: '700'
                                                            }}
                                                        >
                                                            {person.is_verified ? 'SÍ (Verificado)' : 'NO (Marcar)'}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => setViewCommentsPerson(person)}
                                                            className="btn btn-secondary"
                                                            style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                                                        >
                                                            Pistas ({person.comments?.length || 0})
                                                        </button>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <div className="admin-actions" style={{ justifyContent: 'flex-end' }}>
                                                            <button
                                                                onClick={() => openEditModal(person)}
                                                                className="btn btn-secondary"
                                                                style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '4px' }}
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePerson(person.id, person.full_name)}
                                                                className="btn btn-danger"
                                                                style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '4px' }}
                                                            >
                                                                Borrar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                                                    No hay personas registradas.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'centers' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Registros de Centros de Acopio</h2>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Total registrados: <strong>{centers.length} centros</strong>
                            </span>
                        </div>

                        <div className="admin-table-card">
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre del Centro</th>
                                            <th>Ubicación</th>
                                            <th>Insumos Necesitados</th>
                                            <th>Contacto</th>
                                            <th>Estado</th>
                                            <th>Habilitado / Verificado</th>
                                            <th style={{ textAlign: 'right' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {centers.length > 0 ? (
                                            centers.map((center) => (
                                                <tr key={center.id}>
                                                    <td><strong>#{center.id}</strong></td>
                                                    <td style={{ fontWeight: '700' }}>{center.name}</td>
                                                    <td>
                                                        <div>{center.address}</div>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                            {center.state} · {center.municipality}
                                                        </span>
                                                    </td>
                                                    <td style={{ fontSize: '0.85rem', fontStyle: 'italic', maxWidth: '250px' }}>
                                                        {center.needs || 'No especificados'}
                                                    </td>
                                                    <td>
                                                        <div>{center.contact_name}</div>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{center.contact_phone}</span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${center.status === 'Activo' ? 'badge-success' : 'badge-warning'}`}>
                                                            {center.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleVerifyCenter(center.id)}
                                                            className="btn"
                                                            style={{
                                                                padding: '4px 8px',
                                                                fontSize: '0.75rem',
                                                                background: center.is_verified ? '#dcfce7' : '#fee2e2',
                                                                color: center.is_verified ? '#15803d' : '#991b1b',
                                                                borderRadius: '4px',
                                                                fontWeight: '700'
                                                            }}
                                                        >
                                                            {center.is_verified ? 'SÍ (Público)' : 'NO (Oculto - Aprobar)'}
                                                        </button>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <button
                                                            onClick={() => handleDeleteCenter(center.id, center.name)}
                                                            className="btn btn-danger"
                                                            style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '4px' }}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                                                    No hay centros de acopio registrados.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'volunteers' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Registros de Voluntarios de Transporte</h2>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Total voluntarios: <strong>{volunteers.length} registrados</strong>
                            </span>
                        </div>

                        <div className="admin-table-card">
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre Completo</th>
                                            <th>Vehículo</th>
                                            <th>Zona de Cobertura</th>
                                            <th>Teléfono</th>
                                            <th>Estado</th>
                                            <th>Contacto Verificado</th>
                                            <th style={{ textAlign: 'right' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {volunteers.length > 0 ? (
                                            volunteers.map((vol) => (
                                                <tr key={vol.id}>
                                                    <td><strong>#{vol.id}</strong></td>
                                                    <td style={{ fontWeight: '700' }}>{vol.name}</td>
                                                    <td>
                                                        <div>{vol.vehicle_type}</div>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{vol.vehicle_model || 'Sin especificar'}</span>
                                                    </td>
                                                    <td>
                                                        <div>{vol.municipality}</div>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{vol.state}</span>
                                                    </td>
                                                    <td><a href={`tel:${vol.phone}`}>{vol.phone}</a></td>
                                                    <td>
                                                        <span className={`badge ${vol.status === 'Disponible' ? 'badge-success' : vol.status === 'En misión' ? 'badge-blue' : 'badge-neutral'}`}>
                                                            {vol.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleVerifyVolunteer(vol.id)}
                                                            className="btn"
                                                            style={{
                                                                padding: '4px 8px',
                                                                fontSize: '0.75rem',
                                                                background: vol.is_verified ? '#dcfce7' : '#fee2e2',
                                                                color: vol.is_verified ? '#15803d' : '#991b1b',
                                                                borderRadius: '4px',
                                                                fontWeight: '700'
                                                            }}
                                                        >
                                                            {vol.is_verified ? 'SÍ (Público)' : 'NO (Aprobar)'}
                                                        </button>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <button
                                                            onClick={() => handleDeleteVolunteer(vol.id, vol.name)}
                                                            className="btn btn-danger"
                                                            style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '4px' }}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                                                    No hay voluntarios registrados.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL DE EDICIÓN DE PERSONAS */}
            {editPerson && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3 className="modal-title">Editar Registro #{editPerson.id}</h3>
                            <button className="modal-close" onClick={() => setEditPerson(null)}>&times;</button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div className="form-group">
                                    <label htmlFor="edit_first_name">Nombre</label>
                                    <input
                                        type="text"
                                        id="edit_first_name"
                                        className="form-control"
                                        value={editForm.first_name}
                                        onChange={e => setEditForm({ ...editForm, first_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit_last_name">Apellido</label>
                                    <input
                                        type="text"
                                        id="edit_last_name"
                                        className="form-control"
                                        value={editForm.last_name}
                                        onChange={e => setEditForm({ ...editForm, last_name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div className="form-group">
                                    <label htmlFor="edit_age">Edad</label>
                                    <input
                                        type="number"
                                        id="edit_age"
                                        className="form-control"
                                        value={editForm.age}
                                        onChange={e => setEditForm({ ...editForm, age: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit_gender">Género</label>
                                    <select
                                        id="edit_gender"
                                        className="form-control"
                                        value={editForm.gender}
                                        onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                                    >
                                        <option value="">Selecciona...</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label htmlFor="edit_location">Último Lugar Visto</label>
                                <input
                                    type="text"
                                    id="edit_location"
                                    className="form-control"
                                    value={editForm.last_seen_location}
                                    onChange={e => setEditForm({ ...editForm, last_seen_location: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label htmlFor="edit_features">Señas Particulares / Vestimenta</label>
                                <textarea
                                    id="edit_features"
                                    className="form-control"
                                    value={editForm.distinctive_features}
                                    onChange={e => setEditForm({ ...editForm, distinctive_features: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label htmlFor="edit_status">Estado de Búsqueda</label>
                                <select
                                    id="edit_status"
                                    className="form-control"
                                    value={editForm.status}
                                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                    required
                                >
                                    <option value="missing">Sin Contacto (Desaparecido)</option>
                                    <option value="found">Localizado a Salvo</option>
                                </select>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setEditPerson(null)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DE MODERACIÓN DE COMENTARIOS */}
            {viewCommentsPerson && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '650px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div className="modal-header">
                            <h3 className="modal-title">Moderación de Pistas: {viewCommentsPerson.full_name}</h3>
                            <button className="modal-close" onClick={() => setViewCommentsPerson(null)}>&times;</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            {viewCommentsPerson.comments && viewCommentsPerson.comments.length > 0 ? (
                                viewCommentsPerson.comments.map((comment) => (
                                    <div key={comment.id} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                        <div style={{ flexGrow: 1 }}>
                                            <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                                <strong>{comment.author_name}</strong> · Tlf: {comment.author_phone} · {formatDate(comment.created_at)}
                                            </div>
                                            <p style={{ fontSize: '0.875rem', color: '#0f172a', lineHeight: '1.4' }}>
                                                {comment.content}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="btn btn-outline-danger"
                                            style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', whiteSpace: 'nowrap' }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>
                                    No hay comentarios ni pistas asociadas a esta persona.
                                </p>
                            )}
                        </div>

                        <div className="modal-footer" style={{ marginTop: '2rem' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setViewCommentsPerson(null)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
