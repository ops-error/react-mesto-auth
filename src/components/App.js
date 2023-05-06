import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
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


function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setPlaceOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setAvatarOpen] = React.useState(false);
    const [isDeletePopupOpen, setDeleteOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isloggedIn, setIsLoggedIn] = React.useState(true);

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

    // закрытие попапов
    function closeAllPopups() {
        setAvatarOpen(false);
        setIsEditProfilePopupOpen(false);
        setPlaceOpen(false);
        setDeleteOpen(false);
        setSelectedCard(null);
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

  return (
    <BrowserRouter>
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page__content">
                <Header />
                <Routes>
                    <Route path='/' element={isloggedIn? <Main onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick} onCardClick={setSelectedCard} cards={cards} onCardLike={handleCardLike} onCardDelete={handleCardDelete} /> : <Navigate to='sign-in' replace />} />
                    <Route path='/sign-up' element={<Register />} />
                    <Route path='/sign-in' element={<Login />} />
                </Routes>
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
    </BrowserRouter>
  );
}

export default App;
