import React from 'react';

export function getBaseUrl(req) {
    let protocol = 'https:'

    let host = req ? req.headers.host : window.location.hostname
    console.log(req);
    if (host.indexOf('localhost') > -1) {
        host = 'localhost:3333'
        protocol = 'http:'
    }

    return `${protocol}//${host}`;
}