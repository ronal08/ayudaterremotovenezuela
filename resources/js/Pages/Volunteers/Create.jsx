import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

const VENEZUELA_STATES = [
    "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar", "Carabobo", "Cojedes", 
    "Delta Amacuro", "Distrito Capital", "Falcón", "Guárico", "Lara", "Mérida", "Miranda", 
    "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo", "Yaracuy", 
    "Zulia", "Vargas (La Guaira)"
];

const VEHICLE_TYPES = ["Motocicleta", "Carro", "Camioneta", "Camión", "Otro"];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        vehicle_type: '',
        vehicle_model: '',
        state: '',
        municipality: '',
        notes: '',
        security_pin: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/voluntarios');
    };

    return (
        <MainLayout stats={null}>
            <Head title="Registrarse como Voluntario - Ayuda Terremoto Venezuela" />

            <div style={{ maxWidth: '700px', margin: '0 auto 6rem auto', padding: '0 1rem' }}>
                <Link href="/voluntarios" className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Cancelar y Volver
                </Link>

                <div className="profile-details-box">
                    <h2 className="section-title" style={{ borderBottom: '2px solid var(--ven-blue)', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
                        Registrarse como Voluntario de Transporte
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* SECCIÓN 1: DATOS PERSONALES */}
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--ven-blue)' }}>
                                1. Datos del Voluntario
                            </h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label htmlFor="name">Nombre Completo *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="form-control"
                                            placeholder="Ej. Juan Pérez"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.name}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">Teléfono de Contacto (WhatsApp / Llamadas) *</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            className="form-control"
                                            placeholder="Ej. 0412-5551234"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            required
                                        />
                                        {errors.phone && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.phone}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 2: DATOS DEL VEHÍCULO Y COBERTURA */}
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--ven-blue)' }}>
                                2. Detalles del Vehículo y Zona de Cobertura
                            </h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label htmlFor="vehicle_type">Tipo de Vehículo *</label>
                                        <select
                                            id="vehicle_type"
                                            className="form-control"
                                            value={data.vehicle_type}
                                            onChange={e => setData('vehicle_type', e.target.value)}
                                            required
                                        >
                                            <option value="">Selecciona...</option>
                                            {VEHICLE_TYPES.map(vt => (
                                                <option key={vt} value={vt}>{vt}</option>
                                            ))}
                                        </select>
                                        {errors.vehicle_type && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.vehicle_type}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="vehicle_model">Modelo / Marca (Opcional)</label>
                                        <input
                                            type="text"
                                            id="vehicle_model"
                                            className="form-control"
                                            placeholder="Ej. Suzuki V-Strom, Toyota Hilux, Empire Keeway"
                                            value={data.vehicle_model}
                                            onChange={e => setData('vehicle_model', e.target.value)}
                                        />
                                        {errors.vehicle_model && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.vehicle_model}</span>}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label htmlFor="state">Estado de Cobertura *</label>
                                        <select
                                            id="state"
                                            className="form-control"
                                            value={data.state}
                                            onChange={e => setData('state', e.target.value)}
                                            required
                                        >
                                            <option value="">Selecciona...</option>
                                            {VENEZUELA_STATES.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        {errors.state && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.state}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="municipality">Municipio / Zona de Cobertura *</label>
                                        <input
                                            type="text"
                                            id="municipality"
                                            className="form-control"
                                            placeholder="Ej. Chacao, Baruta, Libertador"
                                            value={data.municipality}
                                            onChange={e => setData('municipality', e.target.value)}
                                            required
                                        />
                                        {errors.municipality && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.municipality}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="notes">Notas / Disponibilidad / Capacidad de carga (Opcional)</label>
                                    <textarea
                                        id="notes"
                                        className="form-control"
                                        placeholder="Ej. Disponible en las tardes. Puedo llevar cajas medianas o botiquines de primeros auxilios. Conozco rutas alternas en caso de trancas."
                                        rows="3"
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                    ></textarea>
                                    {errors.notes && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.notes}</span>}
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 3: PIN DE SEGURIDAD */}
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--warning-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                3. PIN de Seguridad
                            </h3>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                                Define un código secreto de 4 dígitos. Lo necesitarás para cambiar tu estado de disponibilidad (Ej. de "Disponible" a "En misión" u "Ocupado") sin tener que iniciar sesión.
                            </p>
                            
                            <div className="form-group" style={{ maxWidth: '250px' }}>
                                <label htmlFor="security_pin">PIN Secreto (4 números) *</label>
                                <input
                                    type="password"
                                    maxLength="4"
                                    pattern="\d{4}"
                                    id="security_pin"
                                    className="form-control"
                                    placeholder="Ej. 1234"
                                    value={data.security_pin}
                                    onChange={e => setData('security_pin', e.target.value.replace(/\D/g, ''))}
                                    required
                                    style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.25rem', background: 'white' }}
                                />
                                {errors.security_pin && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.security_pin}</span>}
                            </div>
                        </div>

                        {/* BOTÓN DE ENVÍO */}
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}
                                disabled={processing}
                            >
                                {processing ? 'Registrando...' : 'Registrarme como Voluntario'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
