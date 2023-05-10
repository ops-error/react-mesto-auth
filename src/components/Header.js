import logo from '../images/logo.svg';
import { useLocation, Link } from 'react-router-dom';
import {useState} from 'react';
import buttonMenuOpen from '../images/button-menu.svg';
import buttonMenuClose from '../images/close-icon.svg';

function Header (props) {
    const location = useLocation();
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [imgButtonMenu, setImgButtonMenu] = useState(buttonMenuOpen);

    const handleClickMenu = () => {
        setIsOpenMenu(!isOpenMenu);
        if (!isOpenMenu) {
            setImgButtonMenu(buttonMenuClose);
        } else {
            setImgButtonMenu(buttonMenuOpen);
        }
    }

    return(
        <header className="header">
            {isOpenMenu && (location.pathname === 'react-mesto-auth/') &&
            <div className='header__menu'>
                <p className='header__element'>{props.email}</p>
                <Link to='react-mesto-auth/sign-in' className='header__element' onClick={props.signOut}>Выход</Link>
            </div>}
            
            <div className='header__container'>
            <img src={logo} alt="Логотип" className="header__logo" />
            {location.pathname === 'react-mesto-auth/sign-in'? <Link to='/sign-up' className='header__link'>Регистрация</Link> : <></>}
            {location.pathname === 'react-mesto-auth/sign-up'? <Link to='/sign-in' className='header__link'>Войти</Link> : <></>}
            {location.pathname === 'react-mesto-auth/'? 
            <button className='header__button' onClick={handleClickMenu}>
                <img alt="Меню" src={imgButtonMenu} style={{width: '100%'}} />
            </button> : <></>}

            {(location.pathname === 'react-mesto-auth/') && 
            <div className='header__menu-full'>
                <p className='header__element-full'>{props.email}</p>
                <Link to='react-mesto-auth/sign-in' className='header__element-full header__element-full_type_last' onClick={props.signOut}>Выход</Link>
            </div>}
            </div>
        </header>
    );
}

export default Header;