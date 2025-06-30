import { JSX } from 'react';
import './home.css';
import Connect from "../../communs/connect/connect";

function Home(): JSX.Element {

    return (
        <div className={'home-container'}>


            <div className="container">
                <h4> Bienvenue sur le portail de gestion de votre inventaire !</h4><br/>


                    <h6>Commencez par vous connecter pour accéder à vos items et les gérer efficacement.</h6><br/>

                < Connect />
            </div>


        </div>
    )
}

export default Home;