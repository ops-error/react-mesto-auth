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

    const handleClickExit = () => {
        if (isOpenMenu) {
            setImgButtonMenu(buttonMenuOpen);
            setIsOpenMenu(!isOpenMenu);
        }
        props.signOut();
    } 

    return(
        <header className="header">
            {isOpenMenu && (location.pathname === '/') &&
            <div className='header__menu'>
                <p className='header__element'>{props.email}</p>
                <Link to='/sign-in' className='header__element' onClick={handleClickExit}>Выход</Link>
            </div>}
            
            <div className='header__container'>
            <img src={logo} alt="Логотип" className="header__logo" />
            {location.pathname === '/sign-in'? <Link to='/sign-up' className='header__link'>Регистрация</Link> : <></>}
            {location.pathname === '/sign-up'? <Link to='/sign-in' className='header__link'>Войти</Link> : <></>}
            {location.pathname === '/'? 
            <button className='header__button' onClick={handleClickMenu}>
                <img alt="Меню" src={imgButtonMenu} style={{width: '100%'}} />
            </button> : <></>}

            {(location.pathname === '/') && 
            <div className='header__menu-full'>
                <p className='header__element-full'>{props.email}</p>
                <Link to='/sign-in' className='header__element-full header__element-full_type_last' onClick={props.signOut}>Выход</Link>
            </div>}
            </div>
        </header>
    );
}

export default Header;