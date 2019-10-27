import React, {Component} from 'react';
import {connect} from 'react-redux';
import {navigate} from '../redux/actions'

class Card extends Component {

    componentDidMount() {
        document.title = this.props.name
    }

    navigate(event) {
        // Это обработчик клика по всему нашему контенту. Поэтому
        // на каждый клик надо сперва проверить, по ссылке ли он.
        if (event.target.tagName === 'A'
            && event.target.hostname === window.location.hostname) {

            // Отменяем стандартное поведение браузера
            event.preventDefault();

            // Запускаем своё действие для навигации
            this.props.dispatch(navigate(event.target));
        }
    }

    render() {
        const {name, html} = this.props;
        return (
            <div>
                <h1>{name}</h1>
                <div
                    dangerouslySetInnerHTML={{__html: html}}
                    onClick={event => this.navigate(event)}
                />
            </div>
        );
    }

}

export default connect()(Card);
