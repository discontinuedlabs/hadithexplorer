import { useEffect, useState } from "react";
import { useLocalStorage } from "./utils";
import HadithSearch from "./components/HadithSearch";
import Header from "./components/Header";

export default function App() {
    const [language, setLanguage] = useLocalStorage("language", "en");

    const [timings, setTimings] = useState([]);

    useEffect(() => {
        let date = new Date();
        date.setHours(19);
        date.setMinutes(35);
        let timing1 = date.getTime();
        setTimings([...timings, timing1]);
        timings.forEach((time) => {
            setTimeout(() => {
                if (!("Notification" in window)) {
                    console.log("This browser does not support desktop notification");
                } else if (Notification.permission === "granted") {
                    var notification = new Notification("Notification title", {
                        body: "Notification body",
                    });
                } else if (Notification.permission !== "denied") {
                    Notification.requestPermission().then(function (permission) {
                        if (permission === "granted") {
                            var notification = new Notification("Notification title", {
                                body: "Notification body",
                            });
                        }
                    });
                }
            }, time);
        });
    }, []);

    return (
        <main className="app" dir={language === "ar" ? "rtl" : "ltr"}>
            <Header language={language} setLanguage={setLanguage} />
            <HadithSearch language={language} setLanguage={setLanguage} />
        </main>
    );
}
