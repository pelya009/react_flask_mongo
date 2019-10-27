export const START_FETCHING_CARD = "START_FETCHING_CARD";
export const FINISH_FETCHING_CARD = "FINISH_FETCHING_CARD";

function fetchCard() {
    return (dispatch, getState) => {
        // Сперва даём состоянию понять, что мы ждём карточку.
        // Наши компоненты после этого могут, например,
        // включить характерную анимацию загрузки.
        dispatch(startFetchingCard());
        // Формируем запрос к API.
        let url = apiPath() + "/card/" + getState().page.cardSlug;
        // Фетчим, обрабатываем, даём состоянию понять, что
        // данные карточки уже доступны. Здесь, конечно, хорошо
        // бы добавить обработку ошибок.
        return fetch(url)
            .then(response => response.json())
            .then(json => dispatch(finishFetchingCard(json)));
    };
    // Кстати, именно redux-thunk позволяет нам
    // использовать в качестве действий лямбды.
}

function startFetchingCard() {
    return {
        type: START_FETCHING_CARD
    };
}

function finishFetchingCard(json) {
    return {
        type: FINISH_FETCHING_CARD,
        cardData: json
    };
}

function apiPath() {
    // Эта функция здесь неспроста. Когда мы сделаем server-side
    // rendering, путь к API будет зависеть от окружения - из
    // контейнера с фронтендом надо будет стучать не в localhost,
    // а в backend.
    return "http://localhost:40001/api/v1";
}

export function fetchCardIfNeeded() {
    return (dispatch, getState) => {
        let state = getState().page;
        if (state.cardData === undefined || state.cardData.slug !== state.cardSlug) {
            return dispatch(fetchCard());
        }
    };
}
