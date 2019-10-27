import React, {Component} from 'react';
import {connect} from 'react-redux'
import {fetchCardIfNeeded} from '../redux/actions'

import Card from './card'

class CardPage extends Component {

    componentWillMount() {
        // Это событие вызывается, когда React собирается
        // отрендерить наш компонент. К моменту рендеринга нам уже
        // уже желательно знать, показывать ли заглушку "данные
        // загружаются" или рисовать карточку, поэтому мы вызываем
        // наше царь-действие здесь. Ещё одна причина - этот метод
        // вызывается также при рендеринге компонент в HTML функцией
        // renderToString, которую мы будем использовать для SSR.
        this.props.dispatch(fetchCardIfNeeded())
    }

    render() {
        const {isFetching, cardData} = this.props;
        return (
            <div>
                {isFetching && <h2>Loading...</h2>}
                {cardData && <Card {...cardData}/>}
            </div>
        );
    }
}

// Поскольку этой компоненте нужен доступ к состоянию, ей нужно
// его обеспечить. Именно для этого мы подключили в зависимости
// пакет react-redux. Помимо содержимого page ей будет передана
// функция dispatch, позволяющая выполнять действия.

function mapStateToProps(state) {
    const {page} = state;
    return page;
}

export default connect(mapStateToProps)(CardPage);
