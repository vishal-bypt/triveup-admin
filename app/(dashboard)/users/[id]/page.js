"use client";

import { Col, Row, Container, Button, Card, Stack } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import userApi from "../../../../api/users";
import moment from "moment";
import UserSkeleton from "./skeleton";
import toast from '../../../../components/utils/toast';

export default function UserDetails() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const router = useRouter();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                const resp = await userApi.getUserDetails(id);
                if (resp?.data?.success) {
                    setUserDetails(resp?.data?.data);
                } else {
                    toast.error(resp?.data?.message);
                }
            } catch (error) {
                console.log("error while fetching user details :", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserDetails();
    }, [id]);

    return (
        <>
            <Container fluid className="p-6">
                <Card>
                    <Card.Header>
                        <Container fluid>
                            <Row className="d-flex align-items-center m-0 p-3">
                                <Col>
                                    <h1 className="m-0">User Details</h1>
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
                        {loading ? <UserSkeleton /> : (
                            <Container fluid className="ps-6">
                                <Stack gap={4}>
                                    <Row className="d-flex align-items-center justify-content-between">
                                        <Col>
                                            <Row>
                                                <Col className="mw-30"><strong>FirstName :</strong></Col>
                                                <Col>{userDetails?.firstName ? userDetails?.firstName : "-"}</Col>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Row>
                                                <Col className="mw-30"><strong>Country :</strong></Col>
                                                <Col>{userDetails?.country ? userDetails?.country : "-"}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="d-flex align-items-center justify-content-between">
                                        <Col>
                                            <Row>
                                                <Col className="mw-30"><strong>LastName :</strong></Col>
                                                <Col>{userDetails?.lastName ? userDetails?.lastName : "-"}</Col>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Row>
                                                <Col className="mw-30"><strong>State :</strong></Col>
                                                <Col>{userDetails?.state ? userDetails?.state : "-"}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="d-flex align-items-center justify-content-between">
                                        <Col>
                                            <Row>
                                                <Col className="mw-30"><strong>Email :</strong></Col>
                                                <Col>{userDetails?.email ? userDetails?.email : "-"}</Col>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Row>
                                                <Col className="mw-30"><strong>City :</strong></Col>
                                                <Col>{userDetails?.city ? userDetails?.city : "-"}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="d-flex align-items-center justify-content-between">
                                        <Col>
                                            <Row>
                                                <Col className="mw-30"><strong>Sex :</strong></Col>
                                                <Col>{userDetails?.sex ? userDetails?.sex : "-"}</Col>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Row>
                                                <Col className="mw-30"><strong>County :</strong></Col>
                                                <Col>{userDetails?.county ? userDetails?.county : "-"}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="d-flex align-items-center justify-content-between">
                                        <Col>
                                            <Row>
                                                <Col className="mw-30"><strong>Role :</strong></Col>
                                                <Col>{userDetails?.role ? userDetails?.role : "-"}</Col>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Row>
                                                <Col className="mw-30"><strong>Status :</strong></Col>
                                                <Col>{userDetails?.status ? userDetails?.status : "-"}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="d-flex align-items-center justify-content-between">
                                        <Col>
                                            <Row>
                                                <Col className="mw-30"><strong>Email Verified :</strong></Col>
                                                <Col>{userDetails?.isEmailVerified ? "Yes" : "No"}</Col>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Row>
                                                <Col className="mw-30"><strong>Created Date :</strong></Col>
                                                <Col>{userDetails?.createdAt ? moment(userDetails?.createdAt).format("DD-MM-YYYY") : "-"}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Stack>
                            </Container>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};