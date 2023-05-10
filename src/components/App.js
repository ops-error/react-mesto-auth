import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../utils/Api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Register from './Register';
import Login from './Login';
import ProtectedRouteElement from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import authApi from '../utils/authApi';


function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setPlaceOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setAvatarOpen] = React.useState(false);
    const [isDeletePopupOpen, setDeleteOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isloggedIn, setIsLoggedIn] = React.useState(false);

    const [email, setEmail] = React.useState('');

    const [isTooltip, setIsTooltip] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const navigate = useNavigate();

    // регистрация
    function handleSubmitDataRegister({email, password}) {
        console.log({email, password});
        authApi.signup({email, password})
        .then((res) => {
            setIsSuccess(true);
            handleOpenTooltip();
            navigate('/sign-in', {replace: true});
        })
        .catch((res) => {
            console.log(res);
            setIsSuccess(false);
            handleOpenTooltip();
        });
    }

    // авторизация
    function handleSubmitDataLogin({email, password}) {
        console.log({email, password});
        authApi.signin({email, password})
        .then((res) => {
            console.log(res);
            if (res.token) {
                handleLogin();
                setEmail(email);
                localStorage.setItem('token', res.token);
                console.log(email);
                navigate('/', {replace: true});
            }
        })
        .catch((res) => {
            console.log(res);
            setIsSuccess(false);
            handleOpenTooltip();
        })
    }

    // проверка токена
    function handleCheckToken() {
        if (localStorage.getItem('token')) {
            const jwt = localStorage.getItem('token');
            authApi.checkToken(jwt)
            .then((res) => {
                if (res) {
                    console.log(res);
                    setIsLoggedIn(true);
                    setEmail(res.data.email);
                    navigate('/', {replace: true});
                }
            })
            .catch((res) => {
                console.log(res);
                setIsSuccess(false);
                handleOpenTooltip();
                navigate('/sign-in', {replace: true});
            });
        }
    }

    React.useEffect(() => {
        handleCheckToken();
    }, []);

    function signOut() {
        setEmail('');
        localStorage.removeItem('token');
    }

    // получение карточек с сервера
    React.useEffect(() => {
        api.getCard()
        .then((res) => {
            setCards(res);
        })
        .catch((res) => {
            console.log(res);
        });
    }, []);

    // получение данных пользователя с сервера
    React.useEffect(() => {
        api.getInfo()
        .then((res) => {
            setCurrentUser(res);
        })
        .catch((res) => {
            console.log(res);
        })
    }, []);

    // поставить/убрать лайк
    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((res) => {
            console.log(res);
        });
    }

    // удаление карточки
    function handleCardDelete(card) {
        api.deleteCard(card._id)
        .then(() => {
            setCards(cards.filter(item => item._id !== card._id));
        })
        .catch((res) => {
            console.log(res);
        });
    }

    // открытие попапов
    function handleEditAvatarClick() {
        setAvatarOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setPlaceOpen(true);
    }

    function handleOpenTooltip() {
        setIsTooltip(true);
    }

    // закрытие попапов
    function closeAllPopups() {
        setAvatarOpen(false);
        setIsEditProfilePopupOpen(false);
        setPlaceOpen(false);
        setDeleteOpen(false);
        setSelectedCard(null);
        setIsTooltip(false);
    }

    function closePopupButton(evt) {
        if (evt.target.classList.contains('popup') || (evt.target.classList.contains('popup__close-icon')) || (evt.key === 'Escape')) {
            closeAllPopups();
        }
    }

    // закрытие попапа на esc
    const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard;

    React.useEffect(() => {
        function closeByEscape(evt) {
            if (evt.key === 'Escape') {
                closeAllPopups();
            }
        }
        if (isOpen) {
            document.addEventListener('keydown', closeByEscape);
            return () => {
                document.removeEventListener('keydown', closeByEscape);
            }
        }
    }, [isOpen]);

    // обновление данных профиля
    function handleUpdateUser(data) {
        setIsLoading(true);
        api.patchInfo(data)
        .then((res) => {
            console.log(res);
            setCurrentUser(res);
            closeAllPopups();
        })
        .catch((res) => {
            console.log(res);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    // обновление аватара
    function handleUpdateAvatar(link) {
        setIsLoading(true);
        api.patchAvatar(link)
        .then((res) => {
            setCurrentUser(res);
            closeAllPopups();
        })
        .catch((res) => {
            console.log(res);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    // добавление карточки
    function handleAddPlaceSubmit(data) {
        setIsLoading(true);
        api.postCard(data)
        .then((newCard) => {
            setCards([newCard, ...cards]);
            closeAllPopups();
        })
        .catch((res) => {
            console.log(res);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    function handleLogin() {
        setIsLoggedIn(true);
    }

  return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page__content">
                <Header email={email} signOut={signOut} />
                <Routes>
                    <Route path='react-mesto-auth/*' element={<ProtectedRouteElement element={Main} onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick} onCardClick={setSelectedCard} cards={cards} onCardLike={handleCardLike} onCardDelete={handleCardDelete} loggedIn={isloggedIn} />} />
                    <Route path='react-mesto-auth/sign-up' element={<Register onSubmit={handleSubmitDataRegister} />} />
                    <Route path='react-mesto-auth/sign-in' element={<Login onSubmit={handleSubmitDataLogin} />} />
                </Routes>
                <InfoTooltip isSuccess={isSuccess} isOpen={isTooltip} onClose={closePopupButton} />
                <Footer />

                {/*Редактировать профиль  */}
                <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closePopupButton} onUpdateUser={handleUpdateUser} isLoading={isLoading} />

                {/* <!-- Новое место --> */}
                <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closePopupButton} onAddPlace={handleAddPlaceSubmit} isLoading={isLoading} />

                {/* <!-- попап удаления карточки --> */}
                <PopupWithForm name="delete" title="Вы уверены?" isOpen={isDeletePopupOpen} onClose={closePopupButton} buttonText='Да' />

                {/* <!-- попап обновить аву --> */}
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closePopupButton} onUpdateAvatar={handleUpdateAvatar} isLoading={isLoading} />

                {/* <!-- картинка на весь экран --> */}
                <ImagePopup card={selectedCard} onClose={closePopupButton} />
            </div>
            
        </CurrentUserContext.Provider>
  );
}

export default App;
