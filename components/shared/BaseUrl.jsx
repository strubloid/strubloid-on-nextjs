import React from 'react';

export function getBaseUrl() {

    const protocol = 'https:'
    const liveAPI = process.env.API;

    if (process.env.NODE_ENV === 'development'){
        return "http://localhost:3333"
    }

    return liveAPI;
}