import React from 'react';
import { Link } from '@inertiajs/react';

export default function MainLayout({ children, stats }) {
    return (
        <div>
            {/* Barra Tricolor Nacional */}
            <div className="tricolor-bar">
                <div className="tricolor-yellow"></div>
                <div className="tricolor-blue"></div>
                <div className="tricolor-red"></div>
            </div>

            {/* Header Principal */}
            <header className="app-header">
                <div className="header-container">
                    <Link href="/" className="logo-link">
                        <span className="logo-text">Desaparecidos Terremoto Venezuela</span>
                        <span className="logo-badge">SOS</span>
                    </Link>
                    <nav className="header-nav">
                        <Link href="/reportar" className="btn btn-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Reportar Persona
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Héroe Informativo y Estadísticas */}
            <div className="hero-section">
                <div className="hero-tag">
                    <span className="pulse-dot"></span>
                    <span>Emergencia Activa · Sismo en Venezuela</span>
                </div>
                <h1 className="hero-title">Reconectemos a cada familia.</h1>
                <p className="hero-desc">
                    Tras el sismo, muchas personas siguen sin comunicarse con sus familiares. Si buscas a alguien, regístralo aquí. Si ya lo encontraste, actualiza su estado para dar tranquilidad a su entorno.
                </p>

                {stats && (
                    <div className="stats-grid">
                        <div className="stat-card neutral">
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Personas Reportadas</div>
                        </div>
                        <div className="stat-card danger">
                            <div className="stat-value">{stats.missing}</div>
                            <div className="stat-label">Aún sin Contacto</div>
                        </div>
                        <div className="stat-card success">
                            <div className="stat-value">{stats.found}</div>
                            <div className="stat-label">Localizados a Salvo</div>
                        </div>
                    </div>
                )}

                {/* Banner de Teléfonos de Emergencia */}
                <div className="hotline-banner">
                    <div className="hotline-info">
                        <h4>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            Teléfonos de Emergencia Nacional
                        </h4>
                        <p>Llama directo desde tu operadora móvil o fija</p>
                    </div>
                    <div className="hotline-numbers">
                        <a href="tel:171" className="hotline-link">
                            171
                            <span>CANTV / Fijo</span>
                        </a>
                        <a href="tel:911" className="hotline-link">
                            911
                            <span>Movistar</span>
                        </a>
                        <a href="tel:112" className="hotline-link">
                            112
                            <span>Digitel</span>
                        </a>
                        <a href="tel:*1" className="hotline-link">
                            *1
                            <span>Movilnet</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Contenido de la Página */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="app-footer">
                <div className="footer-container">
                    <div className="footer-grid">
                        <div className="footer-section">
                            <h5>Aeroambulancias y Rescate</h5>
                            <ul className="footer-list">
                                <li><strong>Aeroambulancias Caracas:</strong> (0212) 993.25.41 / 992.89.80</li>
                                <li><strong>Rescarven Emergencias:</strong> (0212) 993.69.11 / 993.13.10</li>
                                <li><strong>Ambulancia Metropolitano:</strong> (0212) 545.45.45 / 577.92.09</li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h5>Acerca de este sitio</h5>
                            <ul className="footer-list">
                                <li>Esta es una herramienta de registro de búsqueda ciudadana independiente.</li>
                                <li>Verifica siempre la información antes de compartirla para evitar falsas alarmas.</li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h5>Reportes y Soporte</h5>
                            <ul className="footer-list">
                                <li>¿Eres rescatista o autoridad y necesitas acceso de administrador?</li>
                                <li>Escríbenos a: <a href="mailto:soporte@ayudaterremotovenezuela.com">soporte@ayudaterremotovenezuela.com</a></li>
                                <li><Link href="/admin/login">Panel de Moderadores</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} Desaparecidos Terremoto Venezuela. Unión y Solidaridad.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
