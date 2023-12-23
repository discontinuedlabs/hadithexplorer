export default function registerServiceWroker() {
    const serviceWorkerURL = `${process.env.PUBLIC_URL}/service-worker.js`;
    navigator.serviceWorker.register(serviceWorkerURL).then((response) => {
        console.log(response);
    });
}
