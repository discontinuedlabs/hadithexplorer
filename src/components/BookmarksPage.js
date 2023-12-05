import React from "react";
import Bookmark from "Bookmark";

export default function BookmarksPage() {
    const [bookmarks, setBookmarks] = React.useState([]);

    return (
        <div className="bookmarks-page">
            {bookmarks.map(() => {
                <Bookmark />;
            })}
        </div>
    );
}
