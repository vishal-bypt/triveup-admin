"use client";

import { useEffect, useState } from "react";
import { Col, Container, Row, Table, Image, Form } from "react-bootstrap";
import eventsApi from "../../../api/events";
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

export default function Events() {
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState("");
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 1000);

    useEffect(() => {
        fetchEvents();
    }, [currentPage, debouncedSearchTerm]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const resp = await eventsApi.getEvents(currentPage, limit, debouncedSearchTerm);
            if (resp?.data?.status === 200) {
                setEvents(resp?.data?.data?.results);
                //setArticles(resp?.data?.data?.results);
                setTotalPages(resp?.data?.data?.totalPages);
            } else {
                toast.error(resp?.data?.message);
            }
        } catch (error) {
            console.log("error while fetching events list", error.message);
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

    const handleEventDelete = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
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

    const handleImageClick = (photo) => {
        if (!photo || !isValidUrl(photo)) {
            return;
        }
        setSelectedImageUrl(photo);
        setIsImageViewerOpen(true);
    };

    const handleConfirmDelete = () => {
        setIsModalOpen(false);
        deleteEvent(selectedEvent.id);
    };

    const deleteEvent = async (eventId) => {
        try {
            const resp = await eventsApi.deleteEvent(eventId);
            if (resp?.data?.status === 204) {
                toast.success("Event deleted successfully");
                fetchEvents();
            } else {
                toast.error(resp?.data?.message);
            }
        } catch (error) {
            console.log("error while deleting event:", error);
        }
    };

    return (
        <Container fluid className="p-6">
            <Row>
                <Col lg={12} md={12} sm={12}>
                    <div className="m-0 p-3 d-flex align-items-center justify-content-between">
                        <h1 className="d-inline">Events</h1>
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
                                {events?.length > 0 && !loading ? (
                                    events.map((event, index) => (
                                        <tr key={index}>
                                            <td className="text-center">
                                                <div>{index + 1 + ((currentPage - 1) * 10)}</div>
                                            </td>
                                            <td className="text-center" style={{ width: 'max-content' }}>
                                                <div style={{ maxWidth: '18vw', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event?.title ? event?.title : "-"}</div>
                                            </td>
                                            <td className="text-center" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <div onClick={() => handleImageClick(event?.photo)} style={{width: '100px', cursor: 'pointer'}}>
                                                    {event?.photo ? (<Image thumbnail src={event?.photo} />) : "-"}
                                                </div>
                                            </td>
                                            <td className="text-center" style={{ width: 'max-content' }}>
                                                <div style={{ maxWidth: '10vw', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {event?.category ? event?.category : "-"}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div style={{ textWrap: 'nowrap' }}>{event?.status ? event?.status : "-"}</div>
                                            </td>
                                            <td className="text-center">
                                                <div style={{ textWrap: 'nowrap' }}>
                                                    {formatDateForInput(event?.date)}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div>
                                                    <Link href={`/events/${event?.id}?mode=read`}>
                                                        <i className={`nav-icon fe fe-eye me-2 fs-4`} style={{ color: '#5D78FF', cursor: 'pointer' }}></i>
                                                    </Link>
                                                    <Link href={`/events/${event?.id}?mode=edit`}>
                                                        <i className={`nav-icon fe fe-edit me-2 fs-4`} style={{ color: '#c3c3c3', cursor: 'pointer' }}></i>
                                                    </Link>
                                                    <i className={`nav-icon fe fe-trash-2 fs-4`} style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleEventDelete(event)}></i>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            {loading ? <Spinner /> : "No events found"}
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
            <Modal title="Delete Event" description="Are You Sure To Delete Event?" isOpen={isModalOpen} onClose={handleModalClose} onConfirm={handleConfirmDelete} />
            <ImageViewer title="Event Image" imageUrl={selectedImageUrl} isOpen={isImageViewerOpen} onClose={handleImageViewerClose} />
        </Container >
    );
};