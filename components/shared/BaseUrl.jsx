import React from 'react';

export function getBaseUrl() {

    const protocol = 'https:'
    const host = process.env.HOST;
    console.log('RAFA');
    console.log(host);

    if (process.env.NODE_ENV === 'development'){
        return "http://localhost:3333"
    }

    return `${protocol}//${host}`;
}