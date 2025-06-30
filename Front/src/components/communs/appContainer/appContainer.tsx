
import './appContainer.css';

import Header from "../header/header";
import Footer from "../footer/footer";

import { Outlet } from 'react-router-dom';

function AppContainer() {
    return (

        <div className="app-container">
            <div className="top">
                <Header/>
            </div>
            <div className="main-content">
                <Outlet/>
            </div>
            <div className="bot">
                <Footer/>
            </div>
        </div>
    );
}

export default AppContainer;