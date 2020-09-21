import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import absoluteUrl from 'next-absolute-url';

export default (req) => {
    const baseUrl = `${publicRuntimeConfig.HOST}/${publicRuntimeConfig.PORT}`;
    const { origin } = absoluteUrl(req, baseUrl);
    return origin;
}