import { useEffect, useState } from "react";
import Category from "./Category";
import { v4 as uuid4 } from "uuid";

export default function CatergoryPage(props) {
    const { categoryContent, language } = props;
    const [title, setTitle] = useState("");
    const [ahadith, setAhadith] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(lastPage - 1, currentPage + 2);

    useEffect(() => {
        setTitle(categoryContent.title);
        setCurrentPage(categoryContent.currentPage);
        setLastPage(categoryContent.lastPage);
        setAhadith([...categoryContent.ahadith]);
    }, [categoryContent]);

    function openHadith(id, title) {
        const URL = `https://hadeethenc.com/api/v1/hadeeths/one/?language=${language}&id=${id}`;
        fetch(URL)
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error(error));
    }

    function handlePreviousPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    function handleNextPage() {
        if (currentPage < lastPage) {
            setCurrentPage(currentPage + 1);
        }
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= lastPage) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="category-page">
            <h2>{title}</h2>

            <div>
                {ahadith.map((element) => (
                    <Category
                        id={element.id}
                        title={element.title}
                        key={uuid4()}
                        openCategory={openHadith}
                    />
                ))}
            </div>

            <div className="page-nav">
                <button className="page-number" onClick={handlePreviousPage}>
                    Previous
                </button>

                <button
                    className={`page-number ${currentPage === 1 ? "current" : ""}`}
                    onClick={() => handlePageChange(1)}
                >
                    1
                </button>
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
                    (pageNummber) => (
                        <button
                            className={`page-number ${
                                pageNummber === currentPage ? "current" : ""
                            }`}
                            key={pageNummber}
                            onClick={() => handlePageChange(pageNummber)}
                        >
                            {pageNummber}
                        </button>
                    )
                )}
                {lastPage > 1 && (
                    <button
                        className={`page-number ${currentPage === lastPage ? "current" : ""}`}
                        onClick={() => handlePageChange(lastPage)}
                    >
                        {lastPage}
                    </button>
                )}

                <button className="page-number" onClick={handleNextPage}>
                    Next
                </button>
            </div>
        </div>
    );
}
