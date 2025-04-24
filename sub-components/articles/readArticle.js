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

  const convertToHTML = (text) => {
    if (!text) return '';
    return text
      .split('\n\n') // Paragraphs
      .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br />')}</p>`)
      .join('');
  };

  return (
    <Container fluid className="ps-6">
      <Stack gap={4}>
        <Row className="d-flex align-items-center justify-content-between">
          
            <Row className="p-4">
              <Col className="mw-30">
                <strong>Title :</strong>
              </Col>
              <Col>{article?.title ? article?.title : "-"}</Col>
            </Row>
          
         
            <Row className="p-4">
              <Col className="mw-30">
                <strong>Category :</strong>
              </Col>
             
              <Col>
                {article?.category ? article?.category : "-"}
              </Col>
            </Row>
            <Row className="p-4">
              <Col className="mw-30">
                <strong>Sub Category :</strong>
              </Col>
              <Col>
                {article?.subcategory ? article?.subcategory : "-"}
              </Col>
            </Row>

            <Row className="p-4">
              <Col className="mw-30">
                <strong>Description :</strong>
              </Col>
              <Col>
                
                <div
                  className="text-gray-800 mx-auto" style={{ whiteSpace: 'pre-line' }}
                  dangerouslySetInnerHTML={{ __html: convertToHTML(article?.content) }}
                />
              </Col>
            </Row>
            <Row className="p-4">
              <Col className="mw-30">
                <strong>Photo :</strong>
              </Col>
              <Col>
                {article?.photo ? (
                  <div
                    style={{ marginTop: "10px" }}
                    onClick={() => handleImageClick(article?.photo)}
                  >
                    <img
                      src={article?.photo}
                      alt="Preview"
                      width="100"
                      height="100"
                      style={{ borderRadius: "8px" }}
                    />
                  </div>
                ) : (
                  "-"
                )}
              </Col>
            </Row>
            <Row className="p-4">
              <Col className="mw-30">
                <strong>Status :</strong>
              </Col>
              <Col>{article?.status ? article?.status : "-"}</Col>
            </Row>
            <Row className="p-4">
              <Col className="mw-30">
                <strong>Date :</strong>
              </Col>
              <Col>{article?.date ? article?.date : "-"}</Col>
            </Row>
         
        </Row>
        
        
        <Row className="d-flex align-items-center justify-content-between">
          <Col>
            
          </Col>
          <Col>
           
          </Col>
        </Row>
      </Stack>
      <ImageViewer
        title="Article Image"
        imageUrl={selectedImageUrl}
        isOpen={isImageViewerOpen}
        onClose={handleImageViewerClose}
      />
    </Container>
  );
};

// ReadArticle.prototype = {
//     article: PropTypes.object.isRequired,
// };

export default ReadArticle;
