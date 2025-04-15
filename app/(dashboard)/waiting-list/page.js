"use client";

import { Col, Row, Container, Table, Pagination  } from "react-bootstrap";
import { useEffect, useState } from "react";
import userApi from "api/users";
import ReactPaginate from "react-paginate";

export default function WaitingList() {
  const [users, setUsers] = useState([]);

  const itemsPerPage = 2;

  // Sample Data
  const data = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    price: `$${(i + 1) * 10}`,
  }));

  const [currentPage, setCurrentPage] = useState(0);

  // Pagination Logic
  const offset = currentPage * itemsPerPage;
  const currentPageData = users.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(users.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    async function fetchUsers() {
      const response = await userApi.getWaitingListUsers();
      if (!response?.data?.success) {
        throw new Error("Failed to fetch data");
      }
      setUsers(response?.data?.data?.user);
    }
    fetchUsers();
  }, []);

  return (
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="container p-3">
            <h1>Waiting List Users</h1>
          </div>
          <Table responsive className="text-nowrap">
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.length > 0 ? (
                currentPageData.map((user, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.status}</td>
                    <td>{user.createdAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </Col>
      </Row>
    </Container>
  );
}
