"use client";

import PropTypes from "prop-types";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import useMounted from "hooks/useMounted";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import articleApi from "../../api/articles";
import categoryApi from "../../api/category";
import toast from "../../components/utils/toast";
import { useRouter } from "next/navigation";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill styles

const EditArticle = ({ article }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    resetField,
  } = useForm();
  const router = useRouter();
  const hasMounted = useMounted();
  const dateRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [imageUploadError, setImageUploadError] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [content, setContent] = useState(convertToHtml(article?.content) || "");

  const handleArticleUpdate = async (data) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (preview && preview instanceof File) {
        formData.append("photo", preview);
      } else {
        formData.append("photo", "photo.png");
      }

      const resp = await articleApi.updateArticleDetails(article?.id, formData);

      if (resp?.data?.success) {
        toast.success("article updated successfully");
        router.back();
      } else {
        toast.error(resp?.data?.message);
      }
    } catch (error) {
      console.log("error while updating article details :", error);
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const resp = await categoryApi.getCategoryList();
        if (resp?.status === 200) {
          setCategoryList(resp?.data);
          const categories = resp?.data.map((category) => category?.category);
          setCategories(categories);
        } else {
          toast.error(resp?.data?.message);
        }
      } catch (error) {
        console.log("error while fetching category list:", error);
      }
    };
    fetchCategory();
  }, [article]);

  useEffect(() => {
    setPreview(article?.photo);
  }, [article]);

  useEffect(() => {
    if (article) {
      setValue("category", article?.category);

      const newCategoryOptions = categoryList?.find(
        (category) => category.category === article?.category
      );
      setSubCategories(newCategoryOptions?.subCategory || []);

      setValue("subcategory", article?.subcategory || "");
    }
  }, [article, categoryList, setValue]);

  const handleChange = (value) => {
    setContent(value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageUploadError("Only image files are allowed!");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);

      setValue("photo", file);
    } else {
      setPreview(null);
      resetField("photo");
    }
  };

  const renderCategoriesOptions = (categories) => {
    return categories?.map((category, index) => (
      <option value={category} key={index}>
        {category}
      </option>
    ));
  };

  const renderSubCategoriesOptions = (subCategories) => {
    return subCategories?.map((subCategory, index) => (
      <option value={subCategory} key={index}>
        {subCategory}
      </option>
    ));
  };

  const handleCategoryChange = (selectedCategory) => {
    const newCategoryOptions = categoryList?.find(
      (category) => category.category === selectedCategory
    );
    setSubCategories(newCategoryOptions?.subCategory);
    setValue("subcategory", "");
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setValue("date", selectedDate);
  };

  function convertToHtml(text = "") {
    if (!text || typeof text !== "string") return "";

    const paragraphs = text.split("\n\n").map((p) => p.trim());

    return paragraphs
      .map((p, i) => {
        const formatted = p.replace(/"([^"]+)"/g, '<em>"$1"</em>');

        if (i === 0) return `<h2>${formatted}</h2>`;
        if (p.toLowerCase().includes("remember that your support"))
          return `<p><strong>${formatted}</strong></p>`;
        return `<p>${formatted}</p>`;
      })
      .join("\n");
  }
  console.log("Date:", formatDateForInput(article?.date));
  return (
    <Container fluid className="ps-6">
      {hasMounted && (
        <Form onSubmit={handleSubmit(handleArticleUpdate)}>
          <Row className="mb-3">
            {/*title*/}
            <Form.Group as={Col} controlId="title">
              <Form.Label>
                Title<sup style={{ color: "red" }}>*</sup>
              </Form.Label>
              <Form.Control
                type="text"
                defaultValue={article?.title || ""}
                placeholder="Enter title"
                {...register("title", {
                  required: "Title is required",
                })}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            {/*description*/}
            <Form.Group as={Col} controlId="description">
              <Form.Label>
                Description<sup style={{ color: "red" }}>*</sup>
              </Form.Label>
              <ReactQuill value={content} onChange={handleChange} />
              <Form.Control.Feedback type="invalid">
                {errors.description?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Row className="mb-3">
              {/*category*/}
              <Form.Group as={Col} controlId="category">
                <Form.Label>
                  Category<sup style={{ color: "red" }}>*</sup>
                </Form.Label>
                <Form.Select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  isInvalid={!!errors.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="">Select category</option>
                  {renderCategoriesOptions(categories)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.category?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              {/*subcategory*/}
              <Form.Group as={Col} controlId="subcategory">
                <Form.Label>
                  Sub-Category<sup style={{ color: "red" }}>*</sup>
                </Form.Label>
                <Form.Select
                  value={article?.subcategory || ""}
                  {...register("subcategory", {
                    required: "Sub-Category is required",
                  })}
                  isInvalid={!!errors.subcategory}
                >
                  <option value="select">Select sub-category</option>
                  {renderSubCategoriesOptions(subCategories)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.subcategory?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Row>

          <Row className="mb-3">
            {/*date*/}
            <Form.Group as={Col} controlId="date">
              <Form.Label>
                Date<sup style={{ color: "red" }}>*</sup>
              </Form.Label>
              <Form.Control
                type="date"
                defaultValue={formatDateForInput(article?.date)}
                ref={(el) => (dateRef.current = el)}
                onClick={() => dateRef.current?.showPicker()}
                onChange={handleDateChange}
                placeholder="Enter date"
                {...register("date", {
                  required: "Date is required",
                })}
                isInvalid={!!errors.date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.date?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            {/*photo*/}
            <Form.Group as={Col}>
              <Form.Label htmlFor="photo">Photo</Form.Label>
              <input
                type="file"
                accept="image/*"
                id="photo"
                onChange={handleFileChange}
                className="form-control"
              />
              {imageUploadError !== "" && (
                <span style={{ color: "red" }}>{imageUploadError}</span>
              )}

              {preview && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={preview}
                    alt="Preview"
                    width="100"
                    height="100"
                    style={{ borderRadius: "8px" }}
                  />
                </div>
              )}
            </Form.Group>
          </Row>
          <Row className="mb-3">
            {/*status*/}
            <Form.Group as={Col} controlId="status">
              <Form.Label>
                Status<sup style={{ color: "red" }}>*</sup>
              </Form.Label>
              <Form.Select
                defaultValue={article?.status || ""}
                {...register("status", {
                  required: "Status is required",
                })}
                isInvalid={!!errors.status}
              >
                <option value="">Select status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.status?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Col
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              <Button type="submit" variant="success">
                Update
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Container>
  );
};

// EditArticle.prototype = {
//     article: PropTypes.object.isRequired,
// };

export default EditArticle;
