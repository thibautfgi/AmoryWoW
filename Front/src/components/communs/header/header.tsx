import { JSX } from 'react';
import './header.css';
import TestItem from "../../communs/test/testItem";
import { Link } from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faFire } from '@fortawesome/free-solid-svg-icons';


function Header(): JSX.Element {
    return (
        <div className="header-container">
            <div className="header-top-row">
                <Link to="/" className="wow-logo"></Link>
            </div>

            <div className={"test"}></div>

            <div className="header-nav-row">
                <nav className="navbar">
                    <Link to="/armurerie" className="nav-link">Armurerie</Link>
                    <Link to="/bestiaire" className="nav-link">Bestiaire</Link>
                    <Link to="/inventaire" className="nav-link-last">Inventaire</Link>
                </nav>
                <div className="header-nav-buttons">
                    <button className="buttonHeader">
                        <FontAwesomeIcon icon={faFire} size="2xs"/>
                    </button>
                </div>


            </div>


            <div className="header-image-band-inverted"></div>
        </div>
    );
}

export default Header;