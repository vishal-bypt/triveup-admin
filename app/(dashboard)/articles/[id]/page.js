"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import articleApi from "../../../../api/articles";
import toast from "../../../../components/utils/toast";
import EditArticle from "../../../../sub-components/articles/editArticle";
import ReadArticle from "../../../../sub-components/articles/readArticle";
import ArticleSkeleton from "./skeleton";
import Link from "next/link";


const ArticleDetails = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [articleDetails, setArticleDetails] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const resp = await articleApi.getArticleDetails(id);
      console.log("resp", resp?.data?.data);
      if (resp?.data?.success) {
        setArticleDetails(resp?.data?.data);
      } else {
        toast.error(resp?.data?.message);
      }
    } catch (error) {
      console.log("error while fetching article details :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container fluid className="p-6">
        <Card>
          <Card.Header>
            <Container fluid>
              <Row className="d-flex align-items-center m-0 py-3">
                <Col>
                  <h1 className="m-0">
                    {mode === "read" ? "Article Details" : "Edit Article"}
                  </h1>
                  {articleDetails?.serp?.link && (
                    <Link
                      href={articleDetails?.serp?.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="primary" className="ms-2" size="sm">
                        View Source
                      </Button>
                    </Link>
                  )}
                </Col>
                <Col className="text-end">
                  <Button
                    variant="dark"
                    onClick={() => {
                      router.back();
                    }}
                  >
                    {"<- Back"}
                  </Button>
                </Col>
              </Row>
            </Container>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <ArticleSkeleton />
            ) : mode === "read" ? (
              <ReadArticle article={articleDetails} />
            ) : (
              <EditArticle article={articleDetails} />
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

ArticleDetails.prototype = {
  isArticleEdit: PropTypes.bool.isRequired,
};

export default ArticleDetails;
