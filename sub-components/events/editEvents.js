"use client";

import PropTypes from 'prop-types';
import { Col, Container, Form, Row, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import useMounted from 'hooks/useMounted';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import eventApi from "../../api/events";
import categoryApi from "../../api/category";
import toast from "../../components/utils/toast";
import { useRouter } from 'next/navigation';

const EditEvent = ({ event }) => {
    const { register, handleSubmit, formState: { errors }, setValue, resetField } = useForm();
    const router = useRouter();
    const hasMounted = useMounted();
    const dateRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [imageUploadError, setImageUploadError] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const handleEventUpdate = async (data) => {
        try { console.log("data", data);
            console.log("preview", preview);
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });

            if (preview && preview instanceof File) {
                formData.append('photo', preview);
            } else {
                formData.append('photo', 'photo.png');
            };

            const resp = await eventApi.updateEventDetails(event?.id, formData);

            if (resp?.data?.success) {
                toast.success("Event updated successfully");
                router.back();
            } else {
                toast.error(resp?.data?.message);
            }
        } catch (error) {
            console.log("error while updating event details :", error);
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
    }, [event]);

    useEffect(() => {
        console.log("Photo====>", event?.photo);
        setPreview(event?.photo);
    }, [event]);

    useEffect(() => {
        if (event) {
            setValue("category", event?.category);

            const newCategoryOptions = categoryList?.find(
                (category) => category.category === event?.category
            );
            setSubCategories(newCategoryOptions?.subCategory || []);

            setValue("subcategory", event?.subcategory || "");
        }
    }, [event, categoryList, setValue]);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log("file", file);
        if (file) {
            if (!file.type.startsWith('image/')) {
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
            <option value={category} key={index}>{category}</option>
        ))
    };

    const renderSubCategoriesOptions = (subCategories) => {
        return subCategories?.map((subCategory, index) => (
            <option value={subCategory} key={index}>{subCategory}</option>
        ))
    };

    const handleCategoryChange = (selectedCategory) => {
        const newCategoryOptions = categoryList?.find((category) => category.category === selectedCategory);
        setSubCategories(newCategoryOptions?.subCategory);
        setValue("subcategory", "");
    };

    const formatDateForInput = (dateString) => {
        const parsedDate = moment(dateString, ["D MMM YYYY", "MMMM D, YYYY", "MMM D, YYYY"]);
        return parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD") : "";
    };

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        setValue("date", selectedDate);
    };

    return (
        <Container fluid className="ps-6">
            {hasMounted &&
                <Form onSubmit={handleSubmit(handleEventUpdate)}>
                    <Row className='mb-3'>
                        {/*title*/}
                        <Form.Group as={Col} controlId='title'>
                            <Form.Label>Title<sup style={{ color: 'red' }}>*</sup></Form.Label>
                            <Form.Control
                                type='text'
                                defaultValue={event?.title || ""}
                                placeholder='Enter title'
                                {...register('title', {
                                    required: "Title is required",
                                })}
                                isInvalid={!!errors.title}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.title?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/*organizationName*/}
                        <Form.Group as={Col} controlId='organizationName'>
                            <Form.Label>Organization Name<sup style={{ color: 'red' }}>*</sup></Form.Label>
                            <Form.Control
                                type='text'
                                defaultValue={event?.organizationName || ""}
                                placeholder='Enter organization'
                                {...register('organizationName', {
                                    required: "Organization Name is required",
                                })}
                                isInvalid={!!errors.organizationName}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.organizationName?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className='mb-3'>
                        {/*description*/}
                        <Form.Group as={Col} controlId='description'>
                            <Form.Label>Description<sup style={{ color: 'red' }}>*</sup></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                defaultValue={event?.description || ""}
                                style={{ resize: "none" }}
                                placeholder='Enter description'
                                {...register('description', {
                                    required: "Description is required",
                                })}
                                isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.description?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Col style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Row>
                                {/*category*/}
                                <Form.Group as={Col} controlId='category'>
                                    <Form.Label>Category<sup style={{ color: 'red' }}>*</sup></Form.Label>
                                    <Form.Select
                                        {...register('category', {
                                            required: "Category is required",
                                        })}
                                        isInvalid={!!errors.category}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                    >
                                        <option value="">Select category</option>
                                        {renderCategoriesOptions(categories)}
                                    </ Form.Select>
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.category?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row>
                                {/*subcategory*/}
                                <Form.Group as={Col} controlId='subcategory'>
                                    <Form.Label>Sub-Category<sup style={{ color: 'red' }}>*</sup></Form.Label>
                                    <Form.Select
                                        {...register('subcategory', {
                                            required: "Sub-Category is required",
                                        })}
                                        isInvalid={!!errors.subcategory}
                                    >
                                        <option value="select">Select sub-category</option>
                                        {renderSubCategoriesOptions(subCategories)}
                                    </Form.Select>
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.subcategory?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                        </Col>
                    </Row>

                    <Row className='mb-3'>
                        {/*subcategory*/}
                        <Form.Group as={Col} controlId='date'>
                            <Form.Label>Time<sup style={{ color: 'red' }}>*</sup></Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={event?.time || ""}
                                placeholder='Enter Time'
                                {...register('time', {
                                    required: "Time is required",
                                    // pattern: {
                                    //     value: /^\d+(\.\d{1,2})?$/,
                                    //     message: "Enter a valid time."
                                    // }
                                })}
                                isInvalid={!!errors.time}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.time?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/*date*/}
                        <Form.Group as={Col} controlId='date'>
                            <Form.Label>Date<sup style={{ color: 'red' }}>*</sup></Form.Label>
                            <Form.Control
                                type="date"
                                defaultValue={formatDateForInput(event?.date)}
                                ref={(el) => (dateRef.current = el)}
                                onClick={() => dateRef.current?.showPicker()}
                                onChange={handleDateChange}
                                placeholder='Enter date'
                                {...register('date', {
                                    required: "Date is required",
                                })}
                                isInvalid={!!errors.date}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.date?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className='mb-3'>
                        {/*photo*/}
                        <Form.Group as={Col}>
                            <Form.Label htmlFor='photo'>Photo</Form.Label>
                            <input
                                type='file'
                                accept='image/*'
                                id='photo'
                                onChange={handleFileChange}
                                className='form-control'
                            />
                            {imageUploadError !== "" && <span style={{ color: 'red' }}>{imageUploadError}</span>}

                            {preview && (
                                <div style={{ marginTop: "10px" }}>
                                    <img src={preview} alt="Preview" width="100" height="100" style={{ borderRadius: "8px" }} />
                                </div>
                            )}
                        </Form.Group>

                        {/*status*/}
                        <Form.Group as={Col} controlId='status'>
                            <Form.Label>Status<sup style={{ color: 'red' }}>*</sup></Form.Label>
                            <Form.Select
                                defaultValue={event?.status || ""}
                                {...register('status', {
                                    required: "Status is required",
                                })}
                                isInvalid={!!errors.status}
                            >
                                <option value="">Select status</option>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="unpublished">Unpublished</option>
                            </ Form.Select>
                            <Form.Control.Feedback type='invalid'>
                                {errors.status?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Col style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                            <Button type="submit" variant='success'>Update</Button>
                        </Col>
                    </Row>
                </Form>
            }
        </Container>
    );
};

// EditEvent.prototype = {
//     event: PropTypes.object.isRequired,
// };

export default EditEvent;