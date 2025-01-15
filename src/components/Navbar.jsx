import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { ACCESS_TOKEN } from '../constants';
import { jwtDecode } from 'jwt-decode';

function Navbar() {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
        setShowMenu(false);
    };

    const toggleVisibility = () => {
        if(localStorage.getItem(ACCESS_TOKEN)){
            setShowMenu((prev) => !prev);
        }
    };

    return (
        <nav className={styles['navbar-container']}>
            <div className={styles['navbar-left']}>
                <h1 className={styles['h1']}>Open Court</h1>
            </div>
            <div className={styles['navbar-right']}>
                <div className={styles['icon-wrapper']} onClick={() => handleNavigate('/notifications/')}>
                    <FontAwesomeIcon icon={faBell} />
                </div>
                <div onClick={toggleVisibility} className={styles['icon-wrapper']}>
                    <FontAwesomeIcon icon={faBars} />
                </div>

                <div>
                    {showMenu && (
                        <div className={styles['options-wrapper']}>
                            <div 
                                className={styles['option']}
                                onClick={() => handleNavigate('/')}
                            >
                                Home
                            </div>
                            <div 
                                className={styles['option']}
                                onClick={() => handleNavigate('/pickup/games/')}
                            >
                                My Games
                            </div>
                            <div 
                                className={styles['option']}
                                onClick={() => handleNavigate('/pickup/create')}
                            >
                                Create Game
                            </div>
                            <div 
                                className={styles['option']}
                                onClick={() => handleNavigate('/logout')}
                            >
                                Logout &nbsp;
                                <FontAwesomeIcon className={styles['logout']} icon={faRightFromBracket} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
