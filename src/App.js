import { useEffect, useRef, useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
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

            <Routes>
                <Route
                    path="/hadithexplorer"
                    element={
                        <HadithSearch
                            language={language}
                            setLanguage={setLanguage}
                            offline={offline}
                            addBookmark={addBookmark}
                            headerRef={headerRef}
                        />
                    }
                />
                <Route
                    path="/hadithexplorer/categories"
                    element={<CategoriesSearch language={language} />}
                />
                <Route
                    path="/hadithexplorer/bookmarks"
                    element={
                        <BookmarksPage
                            bookmarks={bookmarks}
                            updateBookmarkValues={updateBookmarkValues}
                            setBookmarks={setBookmarks}
                        />
                    }
                />
            </Routes>

            <nav>
                <li>
                    <Link to="/hadithexplorer">Home</Link>
                </li>
                <li>
                    <Link to="/hadithexplorer/categories">Categories</Link>
                </li>
                <li>
                    <Link to="/hadithexplorer/bookmarks">Bookmarks</Link>
                </li>
            </nav>
        </main>
    );
}
