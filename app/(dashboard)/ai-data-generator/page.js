"use client";

import {
  Col,
  Row,
  Container,
  Card,
  Table,
  Form,
  Button,
} from "react-bootstrap";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import categoryApi from "../../../api/category";
import generateAiApi from "../../../api/generate-ai-data";
import { startLoading, stopLoading } from "../../../store/LoaderSlice";
import { useDispatch } from "react-redux";
import toast from "../../../components/utils/toast";

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: 450, // Set your desired width here
  }),
};

const contentType = [
  { label: "Article", value: "Article" },
  // { label: "Event", value: "Event" },
];

export default function AIDataGenerator() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(1000);
  const [categoriesResponse, setCategoryResponse] = useState(1);
  const [categories, setCategories] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [response, setResponse] = useState();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      fetchSubCategories(selectedCategories);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategories]);

  const fetchCategories = async () => {
    try {
      //setLoading(true);
      dispatch(startLoading());
      const resp = await categoryApi.getCategoryList();
      setCategoryResponse(resp?.data);
      if (resp?.status === 200) {
        const options = resp?.data.map((item) => ({
          label: item.category,
          value: item.category,
        }));
        setCategories(options);
      } else {
        toast.error("Data not found");
      }
    } catch (error) {
      console.log("error while fetching users list", error.message);
      dispatch(stopLoading());
    } finally {
      dispatch(stopLoading());
    }
  };

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const selectedCategoryValues = selectedCategories.map((cat) => cat.value);
      // Filter relevant categories and flatten all subcategories
      const subCategories = categoriesResponse
        .filter((item) => selectedCategoryValues.includes(item.category))
        .flatMap((item) => item.subCategory || []);
      // Map to desired format
      const formattedSubCategories = subCategories.map((subCat) => ({
        label: subCat,
        value: subCat,
      }));
      setSubcategories(formattedSubCategories);
    } catch (error) {
      console.log("Error while fetching subcategories", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateData = async (formData) => {
    try {
      dispatch(startLoading());
      console.log("formData", formData);
      let resp;
      if (formData.contentType.value === "Event") {
        resp = await generateAiApi.generateEvents({
          category: formData.category.map((cat) => cat.value).join(","),
          subCategory: formData.subCategory
            .map((subCat) => subCat.value)
            .join(","),
          contentType: formData.contentType.value,
        });
        setResponse(resp?.data?.results);
      } else {
        resp = await generateAiApi.generateArticles({
          category: formData.category.map((cat) => cat.value).join(","),
          subCategory: formData.subCategory
            .map((subCat) => subCat.value)
            .join(","),
          contentType: formData.contentType.value,
        });
        console.log("resp", resp);
        setResponse(resp?.data?.results);
      }

      dispatch(stopLoading());
      setGeneratedCount(resp?.data?.count);
      if (resp?.status === 200) {
        reset();
        setSelectedCategories([]);
        setCategories([]);
        setSubcategories([]);
        toast.success("Data generated successfully");
      } else {
        toast.error("Error generating data");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(stopLoading());
    }
  };
  console.log("response", response);
  return (
    <Container fluid className="p-6">
      <Form onSubmit={handleSubmit(handleGenerateData)}>
        <Card>
          <Card.Header>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <div className="m-0 p-3 d-flex align-items-center justify-content-between">
                  <h1 className="d-inline">Trive Up AI Data Generator</h1>
                </div>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <div className="m-0 p-3 d-flex align-items-center justify-content-between">
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={categories}
                        value={selectedCategories}
                        onChange={(selected) => {
                          field.onChange(selected);
                          setSelectedCategories(selected);
                        }}
                        styles={customStyles}
                      />
                    )}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <div className="m-0 p-3 d-flex align-items-center justify-content-between">
                  <Controller
                    name="subCategory"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={subcategories}
                        styles={customStyles}
                      />
                    )}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <div className="m-0 p-3 d-flex align-items-center justify-content-between">
                  <Controller
                    name="contentType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={contentType}
                        styles={customStyles}
                      />
                    )}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <div className="m-0 p-3 d-flex align-items-center justify-content-between">
                  <Button type="submit" variant="primary" className="">
                    Generate Data{" "}
                  </Button>
                </div>
              </Col>
            </Row>
            {generatedCount > 0 && (
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <div className="m-0 p-3 d-flex align-items-center justify-content-between">
                    <h3>Generated data: {generatedCount}</h3>
                  </div>
                </Col>
                <Col lg={12} md={12} sm={12}>
                  <div>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th width="20%">Title</th>
                          <td>{response?.title}</td>
                        </tr>
                        <tr>
                          <th width="20%">Description</th>
                          <td
                            className="border px-4 py-2"
                            style={{ whiteSpace: "pre-line" }}
                            dangerouslySetInnerHTML={{
                              __html: response?.content,
                            }}
                          />
                        </tr>
                        <tr>
                          <th width="20%">Category</th>
                          <td>{response?.category}</td>
                        </tr>
                        <tr>
                          <th width="20%">Sub Category</th>
                          <td>{response?.subcategory}</td>
                        </tr>
                      </thead>
                    </Table>
                  </div>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      </Form>
    </Container>
  );
}
