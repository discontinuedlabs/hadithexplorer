import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "./utils";
import Header from "./components/Header";
import HadithSearch from "./components/HadithSearch";
import CategoriesSearch from "./components/CategoriesSearch";
import BookmarksPage from "./components/BookmarksPage";

export default function App() {
    const [language, setLanguage] = useLocalStorage("language", "en");
    const [offline, setOffline] = useState(false);
    const [bookmarks, setBookmarks] = useLocalStorage("bookmarks", []);
    const headerRef = useRef(null);

    useEffect(() => {
        function handleNetworkChange() {
            setOffline(!navigator.onLine);
        }
        window.addEventListener("load", () => {
            window.addEventListener("online", handleNetworkChange);
            window.addEventListener("offline", handleNetworkChange);
        });
        return () => {
            window.removeEventListener("load", handleNetworkChange);
            window.removeEventListener("online", handleNetworkChange);
            window.removeEventListener("offline", handleNetworkChange);
        };
    });

    function addBookmark(newBookmark) {
        setBookmarks([...bookmarks, newBookmark]);
    }

    function updateBookmarkValues(id, newValues) {
        setBookmarks(
            bookmarks.map((bookmark) => {
                return bookmark.id === id ? { ...bookmark, ...newValues } : bookmark;
            })
        );
    }

    return (
        <main className="app" dir={language === "ar" ? "rtl" : "ltr"}>
            <Header language={language} setLanguage={setLanguage} ref={headerRef} />
            <HadithSearch
                language={language}
                setLanguage={setLanguage}
                offline={offline}
                addBookmark={addBookmark}
                headerRef={headerRef}
            />
            <CategoriesSearch language={language} />
            <BookmarksPage
                bookmarks={bookmarks}
                updateBookmarkValues={updateBookmarkValues}
                setBookmarks={setBookmarks}
            />
        </main>
    );
}
