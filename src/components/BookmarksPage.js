import React from "react";
import Bookmark from "./Bookmark";

export default function BookmarksPage(props) {
    const { bookmarks, updateBookmarkValues, setBookmarks } = props;

    return (
        <div className="bookmarks-page">
            {bookmarks.map((item) => {
                return (
                    <Bookmark
                        contentObject={item}
                        key={item.id}
                        updateBookmarkValues={updateBookmarkValues}
                        setBookmarks={setBookmarks}
                        bookmarks={bookmarks}
                    />
                );
            })}
        </div>
    );
}
