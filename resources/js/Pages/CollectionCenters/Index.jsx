import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

const VENEZUELA_STATES = [
    "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar", "Carabobo", "Cojedes", 
    "Delta Amacuro", "Distrito Capital", "Falcón", "Guárico", "Lara", "Mérida", "Miranda", 
    "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo", "Yaracuy", 
    "Zulia", "Vargas (La Guaira)"
];

export default function Index({ centers, stats, filters, flash }) {
    const [search, setSearch] = useState(filters.search || '');
    const [state, setState] = useState(filters.state || '');
    const [status, setStatus] = useState(filters.status || '');
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCenter, setSelectedCenter] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        pin: '',
        status: 'Activo',
        needs: ''
    });

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        applyFilters(val, state, status);
    };

    const handleStateChange = (e) => {
        const val = e.target.value;
        setState(val);
        applyFilters(search, val, status);
    };

    const handleStatusChange = (e) => {
        const val = e.target.value;
        setStatus(val);
        applyFilters(search, state, val);
    };

    const applyFilters = (searchVal, stateVal, statusVal) => {
        router.get('/centros', {
            search: searchVal,
            state: stateVal,
            status: statusVal
        }, {
            preserveState: true,
            replace: true
        });
    };

    const openUpdateModal = (center) => {
        setSelectedCenter(center);
        setData({
            pin: '',
            status: center.status,
            needs: center.needs || ''
        });
        setIsModalOpen(true);
    };

    const closeUpdateModal = () => {
        setIsModalOpen(false);
        setSelectedCenter(null);
        reset();
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        post(`/centros/${selectedCenter.id}/actualizar`, {
            onSuccess: () => closeUpdateModal()
        });
    };

    return (
        <MainLayout stats={null}>
            <Head title="Centros de Acopio - Ayuda Terremoto Venezuela" />

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 6rem 1rem' }}>
                
                {/* Cabecera y botón de creación */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                            Centros de Acopio
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            Ubicaciones oficiales y ciudadanas para recibir agua, comida y suministros médicos.
                        </p>
                    </div>
                    <Link href="/centros/nuevo" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '0.25rem' }}>
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Registrar Centro de Acopio
                    </Link>
                </div>

                {/* Mensajes Flash */}
                {flash && flash.success && (
                    <div className="alert alert-success" style={{ marginBottom: '2rem' }}>{flash.success}</div>
                )}
                {flash && flash.error && (
                    <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>{flash.error}</div>
                )}

                {/* Barra de Filtros */}
                <div className="filters-bar-premium">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <input
                            type="text"
                            placeholder="Buscar por nombre, insumos o dirección..."
                            className="form-control"
                            value={search}
                            onChange={handleSearchChange}
                            style={{ height: '100%' }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <select className="form-control" value={state} onChange={handleStateChange} style={{ height: '100%' }}>
                            <option value="">Todos los Estados</option>
                            {VENEZUELA_STATES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <select className="form-control" value={status} onChange={handleStatusChange} style={{ height: '100%' }}>
                            <option value="">Cualquier Estado</option>
                            <option value="Activo">Recibiendo Insumos (Activo)</option>
                            <option value="Lleno">Capacidad Completa (Lleno)</option>
                        </select>
                    </div>
                </div>

                {/* Directorio de Centros */}
                {centers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: '1rem' }}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>No se encontraron centros de acopio</h4>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Prueba con otros términos de búsqueda o selecciona otro estado.</p>
                    </div>
                ) : (
                    <div className="cards-grid">
                        {centers.map(center => (
                            <div key={center.id} className="card-premium">
                                {/* Encabezado de la Tarjeta */}
                                <div className="card-header-flex">
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                            {center.name}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                            <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                                                {center.state} · {center.municipality}
                                            </span>
                                            {center.is_verified && (
                                                <span className="badge badge-blue" style={{ fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                                                    </svg>
                                                    Oficial
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`badge ${center.status === 'Activo' ? 'badge-success' : center.status === 'Lleno' ? 'badge-warning' : 'badge-danger'}`} style={{ whiteSpace: 'nowrap' }}>
                                        {center.status}
                                    </span>
                                </div>

                                {/* Cuerpo de la Tarjeta */}
                                <div className="card-body-content">
                                    {center.photo_url && (
                                        <div style={{ width: '100%', height: '160px', borderRadius: '6px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                            <img src={center.photo_url} alt={center.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}

                                    <div>
                                        <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dirección</strong>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                                            {center.address}
                                        </p>
                                    </div>

                                    <div>
                                        <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Contacto</strong>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                                            {center.contact_name} - <a href={`tel:${center.contact_phone}`} style={{ color: 'var(--accent-color)', fontWeight: '600', textDecoration: 'none' }}>{center.contact_phone}</a>
                                        </p>
                                    </div>

                                    <div style={{ marginTop: '0.5rem', background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: '6px', borderLeft: '3px solid var(--ven-blue)' }}>
                                        <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                                            Insumos Requeridos:
                                        </strong>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.4' }}>
                                            {center.needs ? center.needs : 'Ninguno especificado actualmente'}
                                        </p>
                                    </div>
                                </div>

                                {/* Acciones de la Tarjeta */}
                                <div className="card-footer-actions">
                                    {center.location_url && (
                                        <a href={center.location_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                <circle cx="12" cy="10" r="3"></circle>
                                            </svg>
                                            Ver Mapa
                                        </a>
                                    )}
                                    <button onClick={() => openUpdateModal(center)} className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', border: '1px solid var(--border-color)', background: 'white' }}>
                                        Actualizar Estado
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal para actualizar estado mediante PIN */}
            {isModalOpen && selectedCenter && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '500px', overflow: 'hidden', boxShadow: 'var(--shadow-premium)' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>Actualizar Centro de Acopio</h3>
                            <button onClick={closeUpdateModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdateSubmit} style={{ padding: '1.5rem' }}>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                                Para modificar el estado o la lista de insumos requeridos de <strong>{selectedCenter.name}</strong>, por favor introduce el PIN de seguridad de 4 dígitos creado al registrar el centro.
                            </p>

                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label htmlFor="needs">Insumos Requeridos Actuales</label>
                                <textarea
                                    id="needs"
                                    className="form-control"
                                    rows="4"
                                    value={data.needs}
                                    onChange={e => setData('needs', e.target.value)}
                                    placeholder="Ej. Agua embotellada, vendas, comida enlatada, suero oral..."
                                ></textarea>
                                {errors.needs && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.needs}</span>}
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label htmlFor="center_status">Estado de Recepción</label>
                                <select
                                    id="center_status"
                                    className="form-control"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                >
                                    <option value="Activo">Recibiendo Insumos (Activo)</option>
                                    <option value="Lleno">Capacidad Completa (Lleno)</option>
                                    <option value="Inactivo">No disponible / Cerrado (Inactivo)</option>
                                </select>
                                {errors.status && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.status}</span>}
                            </div>

                            <div className="form-group" style={{ maxWidth: '180px', marginBottom: '1.5rem' }}>
                                <label htmlFor="modal_pin">PIN de Seguridad (4 dígitos)</label>
                                <input
                                    type="password"
                                    id="modal_pin"
                                    maxLength="4"
                                    pattern="\d{4}"
                                    className="form-control"
                                    value={data.pin}
                                    onChange={e => setData('pin', e.target.value.replace(/\D/g, ''))}
                                    style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.15rem' }}
                                    required
                                />
                                {errors.pin && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.pin}</span>}
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                                <button type="button" onClick={closeUpdateModal} className="btn btn-secondary" style={{ background: 'white', border: '1px solid var(--border-color)' }}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
