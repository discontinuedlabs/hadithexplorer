export default function registerServiceWroker() {
    const serviceWorkerURL = `${process.env.PUBLIC_URL}/service-worker.js`;
    navigator.serviceWorker.register(serviceWorkerURL).then((response) => {
        console.log(response);
    });
}

const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
    plugins: [
        new GenerateSW({
            // These options encourage the ServiceWorkers to get in there fast,
            // so that they can start controlling pageloads within seconds.
            clientsClaim: true,
            skipWaiting: true,
        }),
    ],
};
