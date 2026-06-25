import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';

export default function Create() {
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        age: '',
        gender: '',
        last_seen_location: '',
        last_seen_at: '',
        distinctive_features: '',
        photo: null,
        reporter_name: '',
        reporter_phone: '',
        reporter_email: '',
        reporter_relationship: '',
        show_reporter_info: false,
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
        post('/reportar');
    };

    return (
        <MainLayout>
            <Head title="Reportar Persona Desaparecida" />

            <div style={{ maxWidth: '700px', margin: '0 auto 6rem auto', padding: '0 1rem' }}>
                <Link href="/" className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Cancelar y Volver
                </Link>

                <div className="profile-details-box">
                    <h2 className="section-title" style={{ borderBottom: '2px solid var(--ven-blue)', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
                        Reportar Persona Desaparecida
                    </h2>

                    <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* SECCIÓN 1: DATOS DE LA PERSONA */}
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--ven-blue)' }}>
                                1. Datos de la Persona Desaparecida
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label htmlFor="first_name">Nombre *</label>
                                        <input
                                            type="text"
                                            id="first_name"
                                            className="form-control"
                                            value={data.first_name}
                                            onChange={e => setData('first_name', e.target.value)}
                                            required
                                        />
                                        {errors.first_name && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.first_name}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="last_name">Apellido *</label>
                                        <input
                                            type="text"
                                            id="last_name"
                                            className="form-control"
                                            value={data.last_name}
                                            onChange={e => setData('last_name', e.target.value)}
                                            required
                                        />
                                        {errors.last_name && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.last_name}</span>}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label htmlFor="age">Edad Aproximada (Opcional)</label>
                                        <input
                                            type="number"
                                            id="age"
                                            className="form-control"
                                            value={data.age}
                                            onChange={e => setData('age', e.target.value)}
                                            min="0"
                                            max="120"
                                        />
                                        {errors.age && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.age}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="gender">Género (Opcional)</label>
                                        <select
                                            id="gender"
                                            className="form-control"
                                            value={data.gender}
                                            onChange={e => setData('gender', e.target.value)}
                                        >
                                            <option value="">Selecciona...</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Femenino">Femenino</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                        {errors.gender && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.gender}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="last_seen_location">Último Lugar Visto (Zona, Municipio o Albergue) *</label>
                                    <input
                                        type="text"
                                        id="last_seen_location"
                                        className="form-control"
                                        placeholder="Ej. Urb. Altamira, cerca del Edif. Residencia Sol, Chacao"
                                        value={data.last_seen_location}
                                        onChange={e => setData('last_seen_location', e.target.value)}
                                        required
                                    />
                                    {errors.last_seen_location && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.last_seen_location}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="last_seen_at">Fecha y Hora de Último Contacto / Avistamiento *</label>
                                    <input
                                        type="datetime-local"
                                        id="last_seen_at"
                                        className="form-control"
                                        value={data.last_seen_at}
                                        onChange={e => setData('last_seen_at', e.target.value)}
                                        required
                                    />
                                    {errors.last_seen_at && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.last_seen_at}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="distinctive_features">Señas Particulares, Tatuajes, Cicatrices o Vestimenta</label>
                                    <textarea
                                        id="distinctive_features"
                                        className="form-control"
                                        placeholder="Ej. Vestía camisa amarilla con jean azul. Tiene una mancha en el brazo izquierdo. Usa lentes recetados."
                                        value={data.distinctive_features}
                                        onChange={e => setData('distinctive_features', e.target.value)}
                                    ></textarea>
                                    {errors.distinctive_features && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.distinctive_features}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Fotografía (Opcional - Máximo 2MB)</label>
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

                        {/* SECCIÓN 2: DATOS DEL REPORTANTE */}
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--ven-blue)' }}>
                                2. Datos de Contacto del Familiar / Reportante
                            </h3>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                                Esta información es vital para verificar el reporte o avisar si se localiza a la persona.
                            </p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label htmlFor="reporter_name">Tu Nombre Completo *</label>
                                        <input
                                            type="text"
                                            id="reporter_name"
                                            className="form-control"
                                            value={data.reporter_name}
                                            onChange={e => setData('reporter_name', e.target.value)}
                                            required
                                        />
                                        {errors.reporter_name && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.reporter_name}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="reporter_relationship">Tu Relación con la Persona *</label>
                                        <input
                                            type="text"
                                            id="reporter_relationship"
                                            className="form-control"
                                            placeholder="Ej. Madre, Padre, Hermana, Vecino"
                                            value={data.reporter_relationship}
                                            onChange={e => setData('reporter_relationship', e.target.value)}
                                            required
                                        />
                                        {errors.reporter_relationship && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.reporter_relationship}</span>}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label htmlFor="reporter_phone">Tu Teléfono de Contacto *</label>
                                        <input
                                            type="tel"
                                            id="reporter_phone"
                                            className="form-control"
                                            placeholder="Ej. 0412-5551234"
                                            value={data.reporter_phone}
                                            onChange={e => setData('reporter_phone', e.target.value)}
                                            required
                                        />
                                        {errors.reporter_phone && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.reporter_phone}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="reporter_email">Tu Correo Electrónico (Opcional)</label>
                                        <input
                                            type="email"
                                            id="reporter_email"
                                            className="form-control"
                                            value={data.reporter_email}
                                            onChange={e => setData('reporter_email', e.target.value)}
                                        />
                                        {errors.reporter_email && <span style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>{errors.reporter_email}</span>}
                                    </div>
                                </div>

                                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        id="show_reporter_info"
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        checked={data.show_reporter_info}
                                        onChange={e => setData('show_reporter_info', e.target.checked)}
                                    />
                                    <label htmlFor="show_reporter_info" style={{ cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>
                                        Deseo mostrar mis datos de contacto públicamente en el perfil. (Dejar desmarcado para mantenerlos ocultos y resguardados).
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 3: PIN DE SEGURIDAD */}
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                3. Crear PIN de Seguridad para Control Posterior
                            </h3>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                                Define un código numérico secreto de 4 dígitos. **Anótalo y resguárdalo**. Te servirá para modificar el estado del reporte a "Localizado a salvo" cuando la persona sea hallada. Evita que terceros malintencionados alteren la información.
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

                        {/* BOTÓN DE PUBLICACIÓN */}
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}
                                disabled={processing}
                            >
                                {processing ? 'Publicando...' : 'Publicar Reporte en la Web'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
