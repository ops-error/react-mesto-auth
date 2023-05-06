class Api {
    constructor(config) {
        this._url = config.baseUrl;
        this._headers = config.headers;
    }

    _handleResponse(res) {
        if (res.ok) {
            return res.json();
          }
        return Promise.reject(new Error('Произошла ошибка'));
    }

    getInfo() {
        return fetch(`${this._url}/users/me`, {
            headers: this._headers
        })
            .then (this._handleResponse);
    }

    getCard() {
        return fetch(`${this._url}/cards`, {
            headers: this._headers
        })
            .then (this._handleResponse);
    }

    patchInfo(data) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                name: data.name,
                about: data.about
            })
        })
            .then (this._handleResponse);
    }

    postCard(data) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                name: data.name,
                link: data.link
            })
        })
            .then (this._handleResponse);
    }

    changeLikeCardStatus(data, isLiked) {
        if (isLiked) {
            return fetch(`${this._url}/cards/${data}/likes`, {
                method: 'DELETE',
                headers: this._headers,
                body: JSON.stringify({data})
            })
                .then (this._handleResponse);
        } else {
            return fetch(`${this._url}/cards/${data}/likes`, {
                method: 'PUT',
                headers: this._headers,
                body: JSON.stringify({data})
            })
                .then (this._handleResponse);
        }
    }

    deleteCard(data) {
        return fetch(`${this._url}/cards/${data}`, {
            method: 'DELETE',
            headers: this._headers,
            body: JSON.stringify({data})
        })
            .then (this._handleResponse);
    }

    putLike(data) {
        return fetch(`${this._url}/cards/${data}/likes`, {
            method: 'PUT',
            headers: this._headers,
            body: JSON.stringify({data})
        })
            .then (this._handleResponse);
    }

    deleteLike(data) {
        return fetch(`${this._url}/cards/${data}/likes`, {
            method: 'DELETE',
            headers: this._headers,
            body: JSON.stringify({data})
        })
            .then (this._handleResponse);
    }

    patchAvatar(link) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                avatar: link
            })
        })
            .then (this._handleResponse);
    }
}

const api = new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-60',
    headers: {
        authorization: '11c262d9-4172-458c-924e-d3009da526d4',
        'Content-type': 'application/json'
    }
});

export default api;