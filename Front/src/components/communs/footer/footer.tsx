import { JSX } from 'react';
import './footer.css';
import TestItem from "../../communs/test/testItem";

function Footer(): JSX.Element {

    return (
        <>
             <footer className=" footer-container">
                <p>© 2024 Armory Adventure. All Rights Reserved</p>
            </footer>
        </>
    )
}

export default Footer;