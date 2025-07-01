// src/components/communs/header/Header.tsx (ajustez le chemin selon votre structure)
import { JSX } from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';
// @ts-ignore
import logo from '../../../assets/image/wow-logo.png';
import { useAuth } from '../authProvider/authProvider'; // Ajustez le chemin

function Header(): JSX.Element {
    const { isAdmin } = useAuth();

    return (
        <div className="header-container">
            <div className="header-top-row">
                <Link to="/" className="wow-logo"></Link>
            </div>

            <div className="header-nav-row">
                <nav className="navbar">
                    <Link to="/armurerie" className="nav-link">Armurerie</Link>
                    <Link to="/inventaire" className={isAdmin ? "nav-link" : "nav-link-last"}>Inventaire</Link>
                    {isAdmin && <Link to="/admin" className="nav-link-last">Admin</Link>}
                </nav>
                <div className="header-nav-buttons">
                    <button className="buttonHeader">
                        <FontAwesomeIcon icon={faFire} size="2xs" />
                    </button>
                </div>
            </div>

            <div className="header-image-band-inverted"></div>
        </div>
    );
}

export default Header;