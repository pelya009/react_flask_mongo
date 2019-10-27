import "@babel/polyfill"
import React from 'react'
import {renderToString} from 'react-dom/server'
import {Provider} from 'react-redux'
import App from './components/app'
import {navigate} from "./redux/actions";
import configureStore from "./redux/configureStore";

function hasPromises(state) {
    return state.promises.length > 0
}

export default async function render(initialState, url) {
    const store = configureStore(initialState);
    store.dispatch(navigate(url));

    let app = (
        <Provider store={store}>
            <App/>
        </Provider>
    );

    // Вызов renderToString запускает жизненный цикл компонент
    // (пусть и ограниченный). CardPage запускает фетч и так далее.
    renderToString(app);

    // Ждём, пока промисы закончатся! Если мы захотим когда-нибудь
    // делать регулярные запросы (логировать пользовательское
    // поведение, например), соответствующие промисы не надо
    // добавлять в этот список.
    let preloadedState = store.getState();
    while (hasPromises(preloadedState)) {
        await preloadedState.promises[0];
        preloadedState = store.getState()
    }

    // Финальный renderToString. Теперь уже ради HTML.
    let content = renderToString(app);

    return {content, preloadedState};
};
