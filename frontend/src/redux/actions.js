import {isServerSide} from "../utility";
import fetch from "cross-fetch";

export const ADD_PROMISE = "ADD_PROMISE";
export const REMOVE_PROMISE = "REMOVE_PROMISE";
export const START_FETCHING_CARD = "START_FETCHING_CARD";
export const FINISH_FETCHING_CARD = "FINISH_FETCHING_CARD";
export const NAVIGATE = "NAVIGATE";

function fetchCard() {
    return (dispatch, getState) => {
        dispatch(startFetchingCard());
        let url = apiPath() + "/card/" + getState().page.cardSlug;
        let promise = fetch(url)
            .then(response => response.json())
            .then(json => {
                dispatch(finishFetchingCard(json));
                // "Я закончил, можете рендерить"
                dispatch(removePromise(promise));
            });
        // "Я запустил промис, дождитесь его"
        return dispatch(addPromise(promise));
    };
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
    if (isServerSide()) {
        return "http://backend:40001/api/v1";
    }
    return "http://localhost:40001/api/v1";
}

function addPromise(promise) {
    return {
        type: ADD_PROMISE,
        promise: promise
    };
}

function removePromise(promise) {
    return {
        type: REMOVE_PROMISE,
        promise: promise,
    };
}

export function fetchCardIfNeeded() {
    return (dispatch, getState) => {
        let state = getState().page;
        if (state.cardData === undefined || state.cardData.slug !== state.cardSlug) {
            return dispatch(fetchCard());
        }
    };
}

export function navigate(link, dontPushState) {

    if (!isServerSide() && !dontPushState) {
        history.pushState({
            pathname: link.pathname,
            href: link.href
        }, "", link.href);
    }
    return {
        type: NAVIGATE,
        path: link.pathname
    }
}
