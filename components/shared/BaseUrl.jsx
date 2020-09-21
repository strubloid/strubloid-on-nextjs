import React from 'react';

export default function getBaseUrl(req) {
    let protocol = 'https:'
    let host = req ? req.headers.host : window.location.hostname
    if (host.indexOf('localhost') > -1) {
        host = 'localhost:3333'
        protocol = 'http:'
    }

    return `${protocol}//${host}`;
}