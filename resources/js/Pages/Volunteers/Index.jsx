import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

const VENEZUELA_STATES = [
    "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar", "Carabobo", "Cojedes", 
    "Delta Amacuro", "Distrito Capital", "Falcón", "Guárico", "Lara", "Mérida", "Miranda", 
    "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo", "Yaracuy", 
    "Zulia", "Vargas (La Guaira)"
];

const VEHICLE_TYPES = ["Motocicleta", "Carro", "Camioneta", "Camión", "Otro"];

export default function Index({ volunteers, stats, filters, flash }) {
    const [search, setSearch] = useState(filters.search || '');
    const [state, setState] = useState(filters.state || '');
    const [vehicleType, setVehicleType] = useState(filters.vehicle_type || '');
    const [status, setStatus] = useState(filters.status || '');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        pin: '',
        status: 'Disponible'
    });

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        applyFilters(val, state, vehicleType, status);
    };

    const handleStateChange = (e) => {
        const val = e.target.value;
        setState(val);
        applyFilters(search, val, vehicleType, status);
    };

    const handleVehicleTypeChange = (e) => {
        const val = e.target.value;
        setVehicleType(val);
        applyFilters(search, state, val, status);
    };

    const handleStatusChange = (e) => {
        const val = e.target.value;
        setStatus(val);
        applyFilters(search, state, vehicleType, val);
    };

    const applyFilters = (searchVal, stateVal, vehicleVal, statusVal) => {
        router.get('/voluntarios', {
            search: searchVal,
            state: stateVal,
            vehicle_type: vehicleVal,
            status: statusVal
        }, {
            preserveState: true,
            replace: true
        });
    };

    const openUpdateModal = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setData({
            pin: '',
            status: volunteer.status
        });
        setIsModalOpen(true);
    };

    const closeUpdateModal = () => {
        setIsModalOpen(false);
        setSelectedVolunteer(null);
        reset();
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        post(`/voluntarios/${selectedVolunteer.id}/actualizar`, {
            onSuccess: () => closeUpdateModal()
        });
    };

    const getVehicleIcon = (type) => {
        switch (type) {
            case 'Motocicleta':
                return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="5" cy="18" r="3"></circle>
                        <circle cx="19" cy="18" r="3"></circle>
                        <path d="M12 18V9.5L16 6h4"></path>
                        <path d="M12 14h5.5l1.5 4"></path>
                        <path d="M5 15h7"></path>
                    </svg>
                );
            case 'Camioneta':
            case 'Camión':
                return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                );
            default:
                return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="22" height="13" rx="2" ry="2"></rect>
                        <line x1="12" y1="16" x2="12" y2="18"></line>
                        <circle cx="6" cy="18" r="2"></circle>
                        <circle cx="18" cy="18" r="2"></circle>
                    </svg>
                );
        }
    };

    return (
        <MainLayout stats={null}>
            <Head title="Voluntarios de Transporte - Ayuda Terremoto Venezuela" />

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 6rem 1rem' }}>
                
                {/* Cabecera y CTA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                            Voluntarios de Transporte
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            Motorizados, conductores y transportistas que apoyan en la movilización de insumos y rescates.
                        </p>
                    </div>
                    <Link href="/voluntarios/registro" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '0.25rem' }}>
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        Registrarme como Voluntario
                    </Link>
                </div>

                {/* Alertas */}
                {flash && flash.success && (
                    <div className="alert alert-success" style={{ marginBottom: '2rem' }}>{flash.success}</div>
                )}
                {flash && flash.error && (
                    <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>{flash.error}</div>
                )}

                {/* Filtros */}
                <div className="filters-bar-premium" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <input
                            type="text"
                            placeholder="Buscar por nombre, vehículo, cobertura..."
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
                        <select className="form-control" value={vehicleType} onChange={handleVehicleTypeChange} style={{ height: '100%' }}>
                            <option value="">Todos los Vehículos</option>
                            {VEHICLE_TYPES.map(vt => (
                                <option key={vt} value={vt}>{vt}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <select className="form-control" value={status} onChange={handleStatusChange} style={{ height: '100%' }}>
                            <option value="">Cualquier Disponibilidad</option>
                            <option value="Disponible">Disponible (En espera)</option>
                            <option value="En misión">En misión (Ocupado)</option>
                            <option value="No disponible">No disponible</option>
                        </select>
                    </div>
                </div>

                {/* Directorio de Voluntarios */}
                {volunteers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: '1rem' }}>
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                        <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>No se encontraron voluntarios</h4>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Prueba con otros términos de búsqueda o selecciona otros filtros.</p>
                    </div>
                ) : (
                    <div className="cards-grid">
                        {volunteers.map(volunteer => (
                            <div key={volunteer.id} className="card-premium">
                                {/* Encabezado de la Tarjeta */}
                                <div className="card-header-flex">
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                            {volunteer.name}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                            <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                                                {volunteer.state} · {volunteer.municipality}
                                            </span>
                                            {volunteer.is_verified && (
                                                <span className="badge badge-blue" style={{ fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                                                    </svg>
                                                    Contacto Verificado
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`badge ${volunteer.status === 'Disponible' ? 'badge-success' : volunteer.status === 'En misión' ? 'badge-blue' : 'badge-neutral'}`} style={{ whiteSpace: 'nowrap' }}>
                                        {volunteer.status}
                                    </span>
                                </div>

                                {/* Cuerpo de la Tarjeta */}
                                <div className="card-body-content">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                        <span style={{ color: 'var(--ven-blue)', display: 'inline-flex' }}>{getVehicleIcon(volunteer.vehicle_type)}</span>
                                        <strong>{volunteer.vehicle_type}</strong>
                                        {volunteer.vehicle_model && <span>({volunteer.vehicle_model})</span>}
                                    </div>

                                    <div>
                                        <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Teléfono de Contacto</strong>
                                        <p style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '700', marginTop: '0.15rem' }}>
                                            <a href={`tel:${volunteer.phone}`} style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>{volunteer.phone}</a>
                                        </p>
                                    </div>

                                    {volunteer.notes && (
                                        <div style={{ marginTop: '0.5rem', background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: '6px' }}>
                                            <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                                                Notas / Capacidad:
                                            </strong>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                                {volunteer.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Acciones de la Tarjeta */}
                                <div className="card-footer-actions">
                                    <button onClick={() => openUpdateModal(volunteer)} className="btn btn-secondary" style={{ flex: 1, padding: '0.6rem', border: '1px solid var(--border-color)', background: 'white' }}>
                                        Actualizar Disponibilidad
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal para actualizar disponibilidad */}
            {isModalOpen && selectedVolunteer && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '400px', overflow: 'hidden', boxShadow: 'var(--shadow-premium)' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>Actualizar Disponibilidad</h3>
                            <button onClick={closeUpdateModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdateSubmit} style={{ padding: '1.5rem' }}>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                                Para cambiar tu disponibilidad como voluntario (<strong>{selectedVolunteer.name}</strong>), por favor introduce tu PIN de seguridad de 4 dígitos.
                            </p>

                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label htmlFor="volunteer_status">Estado Actual</label>
                                <select
                                    id="volunteer_status"
                                    className="form-control"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                >
                                    <option value="Disponible">Disponible (En espera)</option>
                                    <option value="En misión">En misión (Ocupado)</option>
                                    <option value="No disponible">No disponible</option>
                                </select>
                                {errors.status && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.status}</span>}
                            </div>

                            <div className="form-group" style={{ maxWidth: '180px', marginBottom: '1.5rem' }}>
                                <label htmlFor="modal_volunteer_pin">PIN de Seguridad (4 dígitos)</label>
                                <input
                                    type="password"
                                    id="modal_volunteer_pin"
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
