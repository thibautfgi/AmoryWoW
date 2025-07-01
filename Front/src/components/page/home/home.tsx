import { JSX } from 'react';
import './home.css';
import { useAuth } from "../../communs/authProvider/authProvider";

// @ts-ignore
import Connect from "../../communs/connect/connect";


function Home(): JSX.Element {
    const { isAuthenticated, user, login } = useAuth();

    return (
        <div className={'home-container'}>
            <div className="container">
                <h4>Bienvenue sur le portail de gestion de votre inventaire !</h4><br />
                {isAuthenticated ? (
                    <>
                        <h6>Bonjour {user}, vous êtes connecté. Gérez vos items avec efficacité !</h6><br />
                        < Connect />
                    </>
                ) : (
                    <>
                        <h6>Commencez par vous connecter pour accéder à vos items et les gérer efficacement.</h6><br />

                        < Connect />
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;