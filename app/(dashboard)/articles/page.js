"use client";

import { useEffect, useState } from "react";
import { Col, Container, Row, Table, Image, Form } from "react-bootstrap";
import articlesApi from "../../../api/articles";
import toast from '../../../components/utils/toast';
import { Spinner } from "../../../sub-components/index";
import ReactPaginate from "react-paginate";
import "../../../styles/articles.scss";
import "../../../styles/paginationStyle.scss";
import Modal from "../../../components/shared/modal";
import ImageViewer from "../../../components/shared/imageViewer";
import moment from "moment";
import Link from "next/link";
import useDebouncedValue from "../../../hooks/useDebouncedValue";

export default function Articles() {
    const [loading, setLoading] = useState(false);
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState("");
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 1000);

    useEffect(() => {
        fetchArticles();
    }, [currentPage, debouncedSearchTerm]);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const resp = await articlesApi.getArticles(currentPage, limit, debouncedSearchTerm);
            if (resp?.data?.status === 200) {
                setArticles(resp?.data?.data?.results);
                setTotalPages(resp?.data?.data?.totalPages);
            } else {
                toast.error(resp?.data?.message);
            }
        } catch (error) {
            console.log("error while fetching articles list", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm]);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const handleArticleDelete = (article) => {
        setSelectedArticle(article);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedArticle(null);
    };

    const handleImageViewerClose = () => {
        setIsImageViewerOpen(false);
        setSelectedImageUrl("");
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };

    const formatDateForInput = (dateString) => {
        const parsedDate = moment(dateString, ["D MMM YYYY", "MMMM D, YYYY", "MMM D, YYYY"]);
        return parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD") : "";
    };

    const handleImageClick = (articleUrl) => {
        if (!articleUrl || !isValidUrl(articleUrl)) {
            return;
        }
        setSelectedImageUrl(articleUrl);
        setIsImageViewerOpen(true);
    };

    const handleConfirmDelete = () => {
        setIsModalOpen(false);
        deleteArticle(selectedArticle.id);
    };

    const deleteArticle = async (articleId) => {
        try {
            const resp = await articlesApi.deleteArticle(articleId);
            if (resp?.data?.status === 200) {
                toast.success("Article deleted successfully");
                fetchArticles();
            } else {
                toast.error(resp?.data?.message);
            }
        } catch (error) {
            console.log("error while deleting article:", error);
        }
    };

    return (
        <Container fluid className="p-6">
            <Row>
                <Col lg={12} md={12} sm={12}>
                    <div className="m-0 p-3 d-flex align-items-center justify-content-between">
                        <h1 className="d-inline">Articles</h1>
                        <div style={{ width: '20%' }}>
                            <Form>
                                <Form.Control
                                    type="text"
                                    placeholder="search articles"
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                    }}
                                    value={searchTerm}
                                />
                            </Form>
                        </div>
                    </div>
                    <div>
                        <Table responsive className="table-striped m-0">
                            <thead>
                                <tr>
                                    <th className="table-head" style={{ width: '5%' }}>#</th>
                                    <th className="table-head" style={{ width: '18%' }}>Title</th>
                                    <th className="table-head" style={{ width: '10%' }}>Image</th>
                                    <th className="table-head" style={{ width: '10%' }}>Category</th>
                                    <th className="table-head" style={{ width: '8%' }}>Status</th>
                                    <th className="table-head" style={{ width: '8%' }}>Date</th>
                                    <th className="table-head" style={{ width: '5%' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.length > 0 && !loading ? (
                                    articles.map((article, index) => (
                                        <tr key={index}>
                                            <td className="text-center">
                                                <div>{index + 1 + ((currentPage - 1) * 10)}</div>
                                            </td>
                                            <td className="text-center" style={{ width: 'max-content' }}>
                                                <div style={{ maxWidth: '18vw', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article?.title ? article?.title : "-"}</div>
                                            </td>
                                            <td className="text-center" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <div onClick={() => handleImageClick(article?.photo)} style={{width: '100px', cursor: 'pointer'}}>
                                                    {article?.photo ? (<Image thumbnail src={article?.photo} />) : "-"}
                                                </div>
                                            </td>
                                            <td className="text-center" style={{ width: 'max-content' }}>
                                                <div style={{ maxWidth: '10vw', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {article?.category ? article?.category : "-"}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div style={{ textWrap: 'nowrap' }}>{article?.status ? article?.status : "-"}</div>
                                            </td>
                                            <td className="text-center">
                                                <div style={{ textWrap: 'nowrap' }}>
                                                    {formatDateForInput(article?.date)}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div>
                                                    <Link href={`/articles/${article.id}?mode=read`}>
                                                        <i className={`nav-icon fe fe-eye me-2 fs-4`} style={{ color: '#5D78FF', cursor: 'pointer' }}></i>
                                                    </Link>
                                                    <Link href={`/articles/${article.id}?mode=edit`}>
                                                        <i className={`nav-icon fe fe-edit me-2 fs-4`} style={{ color: '#c3c3c3', cursor: 'pointer' }}></i>
                                                    </Link>
                                                    <i className={`nav-icon fe fe-trash-2 fs-4`} style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleArticleDelete(article)}></i>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            {loading ? <Spinner /> : "No articles found"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                    <div className="mt-4">
                        <ReactPaginate
                            previousLabel={"← Previous"}
                            nextLabel={"Next →"}
                            breakLabel={"..."}
                            pageCount={totalPages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            forcePage={currentPage - 1}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination justify-content-center"}
                            pageClassName={"page-item custom-color"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item custom-color"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item custom-color"}
                            nextLinkClassName={"page-link"}
                            breakClassName={"page-item custom-color"}
                            breakLinkClassName={"page-link"}
                            activeClassName={"active custom-color"}
                        />
                    </div>
                </Col>
            </Row >
            <Modal title="Delete Article" description="Are You Sure To Delete Article?" isOpen={isModalOpen} onClose={handleModalClose} onConfirm={handleConfirmDelete} />
            <ImageViewer title="Article Image" imageUrl={selectedImageUrl} isOpen={isImageViewerOpen} onClose={handleImageViewerClose} />
        </Container >
    );
};