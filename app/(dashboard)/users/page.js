"use client";

import { Col, Row, Container, Table, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import userApi from "../../../api/users";
import ReactPaginate from "react-paginate";
import toast from '../../../components/utils/toast';
import "../../../styles/user.scss";
import "../../../styles/paginationStyle.scss";
import { Spinner } from "../../../sub-components/index";
import moment from "moment";
import Modal from "../../../components/shared/modal";
import Link from "next/link";
import useDebouncedValue from "../../../hooks/useDebouncedValue";

export default function Users() {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 1000);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, debouncedSearchTerm]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const resp = await userApi.getUsersList(currentPage, limit, debouncedSearchTerm);
            if (resp?.data?.status === 200) {
                setUsers(resp?.data?.data?.results);
                setTotalPages(resp?.data?.data?.totalPages);
            } else {
                toast.error(resp?.data?.message);
            }
        } catch (error) {
            console.log("error while fetching users list", error.message);
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

    const handleUserDelete = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleConfirmDelete = () => {
        setIsModalOpen(false);
        deleteUser(selectedUser.id);
    };

    const deleteUser = async (userId) => {
        try {
            const resp = await userApi.deleteUser(userId);
            if (resp?.data?.status === 200) {
                toast.success("User deleted successfully");
                fetchUsers();
            } else {
                toast.error(resp?.data?.message);
            }
        } catch (error) {
            console.log("error while deleting user:", error);
        }
    };

    return (
        <Container fluid className="p-6">
            <Row>
                <Col lg={12} md={12} sm={12}>
                    <div className="m-0 p-3 d-flex align-items-center justify-content-between">
                        <h1 className="d-inline">Users</h1>
                        <div style={{ width: '20%' }}>
                            <Form>
                                <Form.Control
                                    type="text"
                                    placeholder="search users"
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                    }}
                                    value={searchTerm}
                                />
                            </Form>
                        </div>
                    </div>
                    <Table responsive className="text-nowrap table table-striped m-0">
                        <thead>
                            <tr>
                                <th className="table-head">#</th>
                                <th className="table-head">First Name</th>
                                <th className="table-head">Last Name</th>
                                <th className="table-head">Email</th>
                                <th className="table-head">Role</th>
                                <th className="table-head">Status</th>
                                <th className="table-head">Created</th>
                                <th className="table-head">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 && !loading ? (
                                users.map((user, index) => (
                                    <tr key={index}>
                                        <td className="text-center">{index + 1 + ((currentPage - 1) * 10)}</td>
                                        <td className="text-center">{user.firstName}</td>
                                        <td className="text-center">{user.lastName}</td>
                                        <td className="text-center">{user.email}</td>
                                        <td className="text-center">{user.role}</td>
                                        <td className="text-center">{user.status}</td>
                                        <td className="text-center">{user?.createdAt ? moment(user?.createdAt).format("DD-MM-YYYY") : "-"}</td>
                                        <td className="text-center">
                                            <div>
                                                <Link href={`/users/${user.id}`}>
                                                    <i className={`nav-icon fe fe-eye me-2 fs-4`} style={{ color: '#5D78FF', cursor: 'pointer' }}></i>
                                                </Link>
                                                {user?.role === "user" && (
                                                    <i className={`nav-icon fe fe-trash-2 fs-4`} style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleUserDelete(user)}></i>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="12" className="text-center">
                                        {loading ? <Spinner /> : "No users found"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
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
            </Row>
            <Modal title="Delete User" description="Are You Sure To Delete User?" isOpen={isModalOpen} onClose={handleModalClose} onConfirm={handleConfirmDelete} />
        </Container>
    );
}
