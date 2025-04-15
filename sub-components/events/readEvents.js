"use client";

//import PropTypes from "prop-types";
import { Container, Row, Col, Stack } from "react-bootstrap";
import moment from "moment";
import ImageViewer from "../../components/shared/imageViewer";
import { useState } from "react";

const ReadEvent = ({ event }) => {
    console.log("-event-", event)
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

    const handleImageClick = (photo) => {
        if (!photo || !isValidUrl(photo)) {
            return;
        }
        setSelectedImageUrl(photo);
        setIsImageViewerOpen(true);
    };

    const handleImageViewerClose = () => {
        setIsImageViewerOpen(false);
        setSelectedImageUrl("");
    };
    console.log("-read event-")
    return (
        <Container fluid className="ps-6">
            <Stack gap={4}>
                <Row className="d-flex align-items-center justify-content-between">
                    <Col>
                        <Row>
                            <Col className="mw-30"><strong>Title :</strong></Col>
                            <Col>{event?.title ? event?.title : "-"}</Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col className="mw-30"><strong>Date :</strong></Col>
                            <Col>{event?.date ? moment(event?.date).format("DD-MM-YYYY") : "-"}</Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="d-flex align-items-center justify-content-between">
                    <Col>
                        <Row>
                            <Col className="mw-30"><strong>Description :</strong></Col>
                            <Col>{event?.description ? event?.description : "-"}</Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row className="mb-4">
                            <Col>
                                <Row>
                                    <Col className="mw-30"><strong>Category :</strong></Col>
                                    <Col>{event?.category ? event?.category : "-"}</Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Row>
                                    <Col className="mw-30"><strong>Sub-Category :</strong></Col>
                                    <Col>{event?.subcategory ? event?.subcategory : "-"}</Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="d-flex align-items-center justify-content-between">
                    <Col>
                        <Row>
                            <Col className="mw-30"><strong>City :</strong></Col>
                            <Col>{event?.city ? event?.city : "-"}</Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col className="mw-30"><strong>State :</strong></Col>
                            <Col>{event?.state ? event?.state : "-"}</Col>
                        </Row>
                    </Col>
                   
                    
                </Row>
                <Row className="d-flex align-items-center justify-content-between">
                <Col>
                        <Row>
                            <Col className="mw-30"><strong>Country :</strong></Col>
                            <Col>{event?.country ? event?.country : "-"}</Col>
                        </Row>
                    </Col>
                    </Row>
                <Row className="d-flex align-items-center justify-content-between">
                    <Col>
                        <Row>
                            <Col className="mw-30"><strong>Photo :</strong></Col>
                            <Col>{event?.photo ? (<div style={{ marginTop: "10px" }} onClick={() => handleImageClick(event?.photo)}>
                                <img src={event?.photo} alt="Preview" width="100" height="100" style={{ borderRadius: "8px" }} />
                            </div>) : "-"}</Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col className="mw-30"><strong>Status :</strong></Col>
                            <Col>{event?.status ? event?.status : "-"}</Col>
                        </Row>
                    </Col>
                </Row>
            </Stack>
            <ImageViewer title="Event Image" imageUrl={selectedImageUrl} isOpen={isImageViewerOpen} onClose={handleImageViewerClose} />
        </Container>
    )
};

// ReadArticle.prototype = {
//     event: PropTypes.object.isRequired,
// };

export default ReadEvent;