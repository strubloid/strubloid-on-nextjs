import React from 'react';

export function getBaseUrl() {

    let protocol = 'https:'
    const host = window.location.hostname;
    console.log('RAFA');
    console.log(window.location.hostname);

    if (process.env.NODE_ENV === 'development'){
        return "http://localhost:3333"
    }

    return `${protocol}//${host}`;
}