import React from 'react';

export function getBaseUrl(req) {

    let protocol = 'https:'
    const host = req ? req.headers.host : window.location.hostname;

    if (process.env.NODE_ENV === 'development'){
        return "http://localhost:3333"
    }

    return `${protocol}//${host}`;
}