"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import eventApi from "../../../../api/events";
import toast from '../../../../components/utils/toast';
import EditEvent from "../../../../sub-components/events/editEvents";
import ReadEvent from "../../../../sub-components/events/readEvents";
import ArticleSkeleton from "./skeleton";

const EventDetails = () => {
    const { id } = useParams();
    console.log("ID", id);
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [articleDetails, setArticleDetails] = useState(null);
    const [eventDetails, setEventDetails] = useState(null);

    useEffect(() => {
        console.log("-called 1-")
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const resp = await eventApi.getEventDetails(id);
                if (resp?.data?.success) {
                    setEventDetails(resp?.data?.data);
                } else {
                    toast.error(resp?.data?.message);
                }
            } catch (error) {
                console.log("error while fetching event details :", error);
            } finally {
                setLoading(false);
            }
        };
        console.log("-called 2-")
        fetchEvent();
    }, [id]);

    // const fetchEvent = async () => {
    //     try {
    //         setLoading(true);
    //         const resp = await eventApi.getEventDetails(id);
    //         if (resp?.data?.success) {
    //             setEventDetails(resp?.data?.data);
    //         } else {
    //             toast.error(resp?.data?.message);
    //         }
    //     } catch (error) {
    //         console.log("error while fetching event details :", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    console.log("-eventDetails-", eventDetails)
    return (
        <>
            <Container fluid className="p-6">
                <Card>
                    <Card.Header>
                        <Container fluid>
                            <Row className="d-flex align-items-center m-0 py-3">
                                <Col>
                                    <h1 className="m-0">{mode === "read" ? "Event Details" : "Edit Event"}</h1>
                                </Col>
                                <Col className="text-end">
                                    <Button variant="dark" onClick={() => { router.back() }}>
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
                            <ReadEvent event={eventDetails} />
                        ) : (
                            <EditEvent event={eventDetails} />
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

// EventDetails.prototype = {
//     isArticleEdit: PropTypes.bool.isRequired,
// };

export default EventDetails;