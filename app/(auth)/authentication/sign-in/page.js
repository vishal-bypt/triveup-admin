'use client'

// import node module libraries
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useMounted from 'hooks/useMounted';
import auth from 'api/auth';
import { useForm } from 'react-hook-form';
import toast from '../../../../components/utils/toast';
import { useState } from 'react';
import { storeAuthUser } from '../../../../components/utils/authUser';
import { storeAuthToken } from '../../../../components/utils/authToken';

const SignIn = () => {
  const hasMounted = useMounted();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const handleUserSignIn = async (data) => {
    try {
      setLoading(true);
      const response = await auth.login({ email: data.email, password: data.password });
      if (response?.data?.success) {
        storeAuthUser(response?.data?.data?.user);
        storeAuthToken(response?.data?.data?.tokens);

        // navigate to dashboard
        toast.success("Login successful!");
        router.push('/');
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log("error while user sign-in", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md">
          {/* Card body */}
          <Card.Body className="p-6">
            <div className="mb-4">
              <Link href="/"><Image src="/images/brand/logo/nav_logo.png" className="img-fluid mb-2" alt="" /></Link>
            </div>
            {/* Form */}
            {hasMounted &&
              <Form onSubmit={handleSubmit(handleUserSignIn)}>
                {/* Username */}
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email here"
                    {...register('email', {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format"
                      }
                    })}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="**************"
                    {...register('password', {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Checkbox */}
                <div className="d-lg-flex justify-content-between align-items-center mb-4">
                  <Form.Check type="checkbox" id="rememberme">
                    <Form.Check.Input type="checkbox" />
                    <Form.Check.Label>Remember me</Form.Check.Label>
                  </Form.Check>
                </div>
                <div>
                  {/* Button */}
                  <div className="d-grid">
                    <Button variant="primary" type="submit" disabled={loading}>Sign In</Button>
                  </div>
                  <div className="d-md-flex justify-content-end mt-4">
                    <div>
                      <Link href="/authentication/forget-password" className="text-inherit fs-5">Forgot your password?</Link>
                    </div>
                  </div>
                </div>
              </Form>}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}


export default SignIn