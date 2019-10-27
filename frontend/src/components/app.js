import React, {Component} from 'react'
import {connect} from "react-redux";
import {navigate} from '../redux/actions'

import CardPage from "./cardPage"

class App extends Component {

    componentDidMount() {
        // Наше приложение только загрузилось -- надо сразу
        // пометить текущее состояние истории как "наше".
        history.replaceState({
            pathname: location.pathname,
            href: location.href
        }, "");

        // Добавляем обработчик того самого события.
        window.addEventListener("popstate", event => this.navigate(event));
    }

    navigate(event) {
        // Триггеримся только на "наше" состояние, иначе пользователь
        // не сможет вернуться по истории на тот сайт, с которого к
        // нам пришёл (or is it a good thing?..)
        if (event.state && event.state.pathname) {
            event.preventDefault();
            event.stopPropagation();

            // Диспатчим наше действие в режиме "не делай pushState".
            this.props.dispatch(navigate(event.state, true));
        }
    }

    render() {
        const {pageType} = this.props;
        return (
            <div>
                {pageType === "card" && <CardPage/>}
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {page} = state;
    const {type} = page;
    return {
        pageType: type
    };
}

export default connect(mapStateToProps)(App);