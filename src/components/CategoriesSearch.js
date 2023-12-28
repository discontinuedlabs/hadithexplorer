import { useEffect, useState } from "react";
import Category from "./Category";
import CatergoryPage from "./CategoryPage";

export default function CategoriesSearch(props) {
    const { language } = props;
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [categoryContent, setCategoryContent] = useState({
        title: "",
        currentPage: 1,
        lastPage: 1,
        ahadith: [],
    });
    const ITEMS_PER_PAGE = 20;
    const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    useEffect(() => {
        const URL = `https://hadeethenc.com/api/v1/categories/list/?language=${language}`;
        fetch(URL)
            .then((response) => response.json())
            .then((data) => setCategories([...data]))
            .catch((error) => console.error(error));
    }, [language]);

    function openCategory(id, title) {
        const URL = `https://hadeethenc.com/api/v1/hadeeths/list/?language=${language}&category_id=${id}`;
        fetch(URL)
            .then((response) => response.json())
            .then((data) => {
                setCategoryContent((prevCategoryContent) => ({
                    ...prevCategoryContent,
                    title: title,
                    currentPage: data.meta.current_page,
                    lastPage: data.meta.last_page,
                    ahadith: data.data.map((element) => {
                        return {
                            id: element.id,
                            title: element.title,
                        };
                    }),
                }));
            })
            .catch((error) => console.error(error));
    }

    function handlePreviousPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    function handleNextPage() {
        const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="categories-search">
            <CatergoryPage categoryContent={categoryContent} language={language} />

            <div className="categories-container">
                {categories
                    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                    .map((element) => (
                        <Category
                            id={element.id}
                            title={element.title}
                            count={element.hadeeths_count}
                            key={element.id}
                            openCategory={openCategory}
                        />
                    ))}
            </div>

            {categories.length === 0 && <p>Loading...</p>}

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
                {totalPages > 1 && (
                    <button
                        className={`page-number ${currentPage === totalPages ? "current" : ""}`}
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                )}

                <button className="page-number" onClick={handleNextPage}>
                    Next
                </button>
            </div>
        </div>
    );
}
