import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

const VENEZUELA_STATES = [
    "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar", "Carabobo", "Cojedes", 
    "Delta Amacuro", "Distrito Capital", "Falcón", "Guárico", "Lara", "Mérida", "Miranda", 
    "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo", "Yaracuy", 
    "Zulia", "Vargas (La Guaira)"
];

export default function Create() {
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        state: '',
        municipality: '',
        contact_name: '',
        contact_phone: '',
        location_url: '',
        photo: null,
        needs: '',
        security_pin: ''
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/centros');
    };

    return (
        <MainLayout stats={null}>
            <Head title="Registrar Centro de Acopio - Ayuda Terremoto Venezuela" />

            <div style={{ maxWidth: '700px', margin: '0 auto 6rem auto', padding: '0 1rem' }}>
                <Link href="/centros" className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Cancelar y Volver
                </Link>

                <div className="profile-details-box">
                    <h2 className="section-title" style={{ borderBottom: '2px solid var(--ven-blue)', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
                        Registrar Centro de Acopio
                    </h2>

                    <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* SECCIÓN 1: DATOS DEL CENTRO */}
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--ven-blue)' }}>
                                1. Información del Centro de Acopio
                            </h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="form-group">
                                    <label htmlFor="name">Nombre del Centro (Ej. Cruz Roja La Candelaria, Iglesia San José) *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.name}</span>}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label htmlFor="state">Estado *</label>
                                        <select
                                            id="state"
                                            className="form-control"
                                            value={data.state}
                                            onChange={e => setData('state', e.target.value)}
                                            required
                                        >
                                            <option value="">Selecciona un estado...</option>
                                            {VENEZUELA_STATES.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        {errors.state && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.state}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="municipality">Municipio / Ciudad *</label>
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
                                    <label htmlFor="address">Dirección Detallada *</label>
                                    <textarea
                                        id="address"
                                        className="form-control"
                                        placeholder="Ej. Calle 3 con Av. Principal, frente a la panadería central, piso 1."
                                        rows="3"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        required
                                    ></textarea>
                                    {errors.address && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.address}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="location_url">Enlace de Ubicación (Google Maps u OpenStreetMap - Opcional)</label>
                                    <input
                                        type="url"
                                        id="location_url"
                                        className="form-control"
                                        placeholder="Ej. https://maps.google.com/?q=..."
                                        value={data.location_url}
                                        onChange={e => setData('location_url', e.target.value)}
                                    />
                                    {errors.location_url && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.location_url}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="needs">Insumos Requeridos Actualmente (Opcional)</label>
                                    <textarea
                                        id="needs"
                                        className="form-control"
                                        placeholder="Ej. Agua potable, vendas, comida enlatada, pañales..."
                                        rows="3"
                                        value={data.needs}
                                        onChange={e => setData('needs', e.target.value)}
                                    ></textarea>
                                    {errors.needs && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.needs}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Fotografía de la Fachada (Opcional - Máximo 2MB)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="form-control"
                                        style={{ background: 'white' }}
                                    />
                                    {errors.photo && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.photo}</span>}
                                    
                                    {photoPreview && (
                                        <div style={{ marginTop: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', maxWidth: '200px' }}>
                                            <img src={photoPreview} alt="Vista previa" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 2: DATOS DE CONTACTO */}
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--ven-blue)' }}>
                                2. Persona de Contacto del Centro
                            </h3>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label htmlFor="contact_name">Nombre del Coordinador/Contacto *</label>
                                    <input
                                        type="text"
                                        id="contact_name"
                                        className="form-control"
                                        placeholder="Ej. Lic. María Fernández"
                                        value={data.contact_name}
                                        onChange={e => setData('contact_name', e.target.value)}
                                        required
                                    />
                                    {errors.contact_name && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.contact_name}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact_phone">Teléfono de Contacto *</label>
                                    <input
                                        type="tel"
                                        id="contact_phone"
                                        className="form-control"
                                        placeholder="Ej. 0424-5551234"
                                        value={data.contact_phone}
                                        onChange={e => setData('contact_phone', e.target.value)}
                                        required
                                    />
                                    {errors.contact_phone && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.contact_phone}</span>}
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
                                Define un código secreto de 4 dígitos. Te servirá para modificar la lista de insumos requeridos o marcar el centro como "Lleno" más adelante sin necesidad de registrar una cuenta.
                            </p>
                            
                            <div className="form-group" style={{ maxWidth: '250px' }}>
                                <label htmlFor="security_pin">PIN Secreto (4 números) *</label>
                                <input
                                    type="password"
                                    maxLength="4"
                                    pattern="\d{4}"
                                    id="security_pin"
                                    className="form-control"
                                    placeholder="Ej. 4321"
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
                                {processing ? 'Registrando...' : 'Registrar Centro de Acopio'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
