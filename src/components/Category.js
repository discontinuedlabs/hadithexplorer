import { useState } from "react";

export default function Category(props) {
    const { id, title, count, openCategory } = props;
    return (
        <button className="category" onClick={() => openCategory(id, title)}>
            <h3>{title}</h3>
            <p>{count || ""}</p>
        </button>
    );
}
