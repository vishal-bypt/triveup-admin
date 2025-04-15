"use client";

import PropTypes from "prop-types";
import { Container, Row, Col, Stack } from "react-bootstrap";
import moment from "moment";
import ImageViewer from "../../components/shared/imageViewer";
import { useState } from "react";

const ReadArticle = ({ article }) => {
    const [selectedImageUrl, setSelectedImageUrl] = useState("");
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };

    const handleImageClick = (articleUrl) => {
        if (!articleUrl || !isValidUrl(articleUrl)) {
            return;
        }
        setSelectedImageUrl(articleUrl);
        setIsImageViewerOpen(true);
    };

    const handleImageViewerClose = () => {
        setIsImageViewerOpen(false);
        setSelectedImageUrl("");
    };

    return (
        <Container fluid className="ps-6">
            <Stack gap={4}>
                <Row className="d-flex align-items-center justify-content-between">
                    <Col>
                        <Row>
                            <Col className="mw-30"><strong>Title :</strong></Col>
                            <Col>{article?.title ? article?.title : "-"}</Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col className="mw-30"><strong>Organization Name :</strong></Col>
                            <Col>{article?.organizationName ? article?.organizationName : "-"}</Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="d-flex align-items-center justify-content-between">
                    <Col>
                        <Row>
                            <Col className="mw-30"><strong>Description :</strong></Col>
                            <Col>{article?.description ? article?.description : "-"}</Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row className="mb-4">
                            <Col>
                                <Row>
                                    <Col className="mw-30"><strong>Category :</strong></Col>
                                    <Col>{article?.category ? article?.category : "-"}</Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Row>
                                    <Col className="mw-30"><strong>Sub-Category :</strong></Col>
                                    <Col>{article?.subcategory ? article?.subcategory : "-"}</Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="d-flex align-items-center justify-content-between">
                    <Col>
                        <Row>
                            <Col className="mw-30"><strong>Price :</strong></Col>
                            <Col>{article?.price ? article?.price : "-"}</Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col className="mw-30"><strong>Date :</strong></Col>
                            <Col>{article?.date ? moment(article?.date).format("DD-MM-YYYY") : "-"}</Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="d-flex align-items-center justify-content-between">
                    <Col>
                        <Row>
                            <Col className="mw-30"><strong>Photo :</strong></Col>
                            <Col>{article?.photo ? (<div style={{ marginTop: "10px" }} onClick={() => handleImageClick(article?.photo)}>
                                <img src={article?.photo} alt="Preview" width="100" height="100" style={{ borderRadius: "8px" }} />
                            </div>) : "-"}</Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col className="mw-30"><strong>Status :</strong></Col>
                            <Col>{article?.status ? article?.status : "-"}</Col>
                        </Row>
                    </Col>
                </Row>
            </Stack>
            <ImageViewer title="Article Image" imageUrl={selectedImageUrl} isOpen={isImageViewerOpen} onClose={handleImageViewerClose} />
        </Container>
    )
};

// ReadArticle.prototype = {
//     article: PropTypes.object.isRequired,
// };

export default ReadArticle;