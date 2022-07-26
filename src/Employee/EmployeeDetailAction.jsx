import {
  Card,
  Table,
  CardBody,
  Input,
  Label,
  CardTitle,
  Row,
  Col,
  Form,
  FormGroup,
  Button,
  InputGroup,
  InputGroupText,
  CardFooter,
  Spinner,
  FormFeedback,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";

import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";

import { http } from "../config/axios";

import "./Employee.css";

const EmployeeDetailAction = () => {
  const [employeeList, setEmployees] = useState([]);

  const [filterBody, setFilterBody] = useState({
    skip: 0,
    limit: 10,
    needCount: true,
    totalCount: 0, // { sortBy: sortOrder ['ASC', 'DESC'] }
  });

  const [showLoader, setShowLoader] = useState(false);

  const [totalCount, setTotalCount] = useState(0);
  const [employeeIndex, setEmployeeIndex] = useState(0);
  const [pageItems, setPageItems] = useState([]);
  const lastPage = useRef(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [defaultValue, setDefaultValue] = useState({
    _id: null,
    employee_name: "",
    email_id: "",
    phone_no: 0,
    sex: "Male",
    flat_no: 0,
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValue,
  });

  useEffect(() => {
    reset(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    getListInformation();
  }, []);

  useEffect(() => {
    const lastItem = Math.ceil(totalCount / filterBody.limit);
    lastPage.current = lastItem;

    formPagination(1, lastItem);
  }, [totalCount]);

  const handlePagination = (count) => {
    setCurrentPage(count);
    formPagination(count);

    switchPage(count);
  };

  const nextPage = () => {
    const newPage = currentPage + 1;

    setCurrentPage(newPage);
    formPagination(newPage);

    switchPage(newPage);
  };

  const previousPage = () => {
    const newPage = currentPage - 1;

    setCurrentPage(newPage);
    formPagination(newPage);

    switchPage(newPage);
  };

  const formPagination = (activePage, last) => {
    const items = [];

    for (let count = 1; count <= lastPage.current; count++) {
      items.push(
        <PaginationItem key={count} active={activePage == count}>
          <PaginationLink
            disabled={activePage == count}
            onClick={() => handlePagination(count)}
          >
            {count}
          </PaginationLink>
        </PaginationItem>
      );
    }

    setPageItems([...items]);
  };

  const getListInformation = async () => {
    setShowLoader(true);
    const response = (await http.post("/employee/list", filterBody)).data;

    if (response.isSuccess && response.data) {
      if (filterBody.needCount) {
        filterBody.needCount = false;

        setFilterBody({ ...filterBody });
        setTotalCount(response.data.count || 0);
      }

      setEmployees(response.data.records || []);
    }
    setShowLoader(false);
  };

  const saveEmployee = async (body) => {
    setShowLoader(true);
    try {
      if (!body._id) {
        const response = (await http.post("/employee/create", body)).data;

        if (response.isSuccess && response.data) {
          toast.success("Employee created successfully");
          employeeList.push(response.data);

          setEmployees([...employeeList]);
        }
      } else {
        const response = (
          await http.patch(`/employee/${defaultValue._id}`, body)
        ).data;
        if (response.isSuccess) {
          toast.success("Employee updated successfully");
          employeeList[employeeIndex] = body;
          setEmployees([...employeeList]);
        }
      }
      setDefaultValue({
        _id: null,
        employee_name: "",
        email_id: "",
        phone_no: 0,
        sex: "Male",
        flat_no: 0,
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      });
    } catch (err) {
      console.log("in error --> ", err);
    }
    setShowLoader(false);
  };

  const switchPage = (page) => {
    filterBody.skip = (page - 1) * filterBody.limit;
    setFilterBody({ ...filterBody });

    getListInformation();
  };

  const editEmployee = (item, index) => {
    setDefaultValue(item);
    setEmployeeIndex(index);
  };

  const deleteEmployee = async (index, id) => {
    setShowLoader(true);

    const response = (await http.delete(`/employee/${id}`)).data;

    if (response.isSuccess) {
      employeeList.splice(index, 1);
      setEmployees([...employeeList]);

      toast.success(response.message);
    } else {
      toast.error(response.message || "Internal Server Error");
    }
    setShowLoader(false);
  };

  return (
    <>
      <Toaster position="top-center" />
      <Card outline className={"card-brand mx-5 my-3"}>
        <CardTitle className="mt-1 mb-1 mx-auto font-medium-2">
          {!defaultValue._id ? "New Employe" : "Edit Employee"}
        </CardTitle>
        <hr />
        <Form onSubmit={handleSubmit((e) => saveEmployee(e))}>
          <CardBody className={"py-0"}>
            <FormGroup floating>
              <Row>
                <Col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                  <Label className="mt-1 required">Employee Name</Label>
                  <Controller
                    id="employee_name"
                    name="employee_name"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter Employee Name",
                      },
                      maxLength: {
                        value: 255,
                        message: "Please enter valid Employee Name",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Employee Name"
                        className="bg-image"
                        invalid={errors.employee_name && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.employee_name && (
                    <FormFeedback>{errors.employee_name.message}</FormFeedback>
                  )}
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                  <Label className="mt-1 required">Email</Label>
                  <Controller
                    id="email_id"
                    name="email_id"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter EmailId",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Enter valid email address",
                        },
                      },
                      maxLength: {
                        value: 255,
                        message: "Please enter valid EmailId",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        id="email_id"
                        type="email"
                        placeholder="Enter email address"
                        maxLength={100}
                        invalid={errors.email_id && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.email_id && (
                    <FormFeedback>{errors.email_id.message}</FormFeedback>
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                  <Label className="mt-1 required">Phone Number</Label>
                  <Controller
                    id="phone_no"
                    name="phone_no"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter Phone No",
                      },
                      maxLength: {
                        value :10,
                        message: "Please enter valid phone number",
                      },
                      pattern: {
                        value: /^\d+$/,
                        message: "Please enter valid phone number",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                      invalid={errors.phone_no && true}
                        placeholder="Enter phone number"
                        maxLength={50}
                        {...field}
                      />
                    )}
                  />
                  {errors.phone_no && (
                    <FormFeedback>{errors.phone_no.message}</FormFeedback>
                  )}
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                  <Label className="mt-1">Sex</Label>
                  <Controller
                    id="sex"
                    name="sex"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="sex"
                        type="select"
                        placeholder="Select sex"
                        {...field}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Input>
                    )}
                  />
                  {errors.sex && (
                    <FormFeedback>{errors.sex.message}</FormFeedback>
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                  <Label className={"mt-1 required"}>Flat No</Label>
                  <Controller
                    id="flat_no"
                    name="flat_no"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter Flat No",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        invalid={errors.flat_no && true}
                        {...field}
                        type="textarea"
                      />
                    )}
                  />
                  {errors.flat_no && (
                    <FormFeedback>{errors.flat_no.message}</FormFeedback>
                  )}
                </Col>

                <Col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                  <Label className={"mt-1 required"}>Street</Label>
                  <Controller
                    id="street"
                    name="street"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter Street",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        invalid={errors.street && true}
                        {...field}
                        type="textarea"
                      />
                    )}
                  />
                  {errors.street && (
                    <FormFeedback>{errors.street.message}</FormFeedback>
                  )}
                </Col>
              </Row>

              <Row>
                <Col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                  <Label className={"mt-1 required"}>City</Label>
                  <Controller
                    id="city"
                    name="city"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter city",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        invalid={errors.city && true}
                        {...field}
                        type="textarea"
                      />
                    )}
                  />
                  {errors.city && (
                    <FormFeedback>{errors.city.message}</FormFeedback>
                  )}
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                  <Label className={"mt-1 required"}>State</Label>
                  <Controller
                    id="state"
                    name="state"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter state",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        invalid={errors.state && true}
                        {...field}
                        type="text"
                      />
                    )}
                  />
                  {errors.state && (
                    <FormFeedback>{errors.state.message}</FormFeedback>
                  )}
                </Col>
              </Row>

              <Row>
                <Col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                  <Label className={"mt-1 required"}>Country</Label>
                  <Controller
                    id="country"
                    name="country"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter country",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        invalid={errors.country && true}
                        {...field}
                        type="text"
                      />
                    )}
                  />
                  {errors.country && (
                    <FormFeedback>{errors.country.message}</FormFeedback>
                  )}
                </Col>
                <Col xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                  <Label className="mt-1">Pincode</Label>
                  <Controller
                    id="pincode"
                    name="pincode"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^\d+$/,
                        message: "Please enter valid pincode",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        placeholder="Enter pincode"
                        maxLength={50}
                        {...field}
                      />
                    )}
                  />
                  {errors.pincode && (
                    <FormFeedback>{errors.pincode.message}</FormFeedback>
                  )}
                </Col>
              </Row>
            </FormGroup>
          </CardBody>

          <hr className="my-0" />
          <CardFooter>
            <Row className="px-1">
              <Col className="text-center">
                {defaultValue._id ? (
                  <Button color="primary" type="submit">
                    Update
                  </Button>
                ) : (
                  <Button color="primary" type="submit">
                    Save
                  </Button>
                )}{" "}
              </Col>
            </Row>
          </CardFooter>
        </Form>
        <CardTitle className="px-1 mb-0">
          <Row className="py-1">
            <Col
              xs="4"
              sm="4"
              md="4"
              lg="4"
              xl="4"
              xxl="4"
              className="text-start"
            ></Col>
          </Row>
        </CardTitle>

        <CardBody className={"px-0 py-0 pt-1"}>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Phone No</th>
                <th>Gender</th>
                <th>State</th>
                <th>Actions</th>
              </tr>
            </thead>
            {showLoader ? (
              <>
                <tbody className="no-border">
                  <tr className="text-center">
                    <td colSpan={10} className="loaderDiv">
                      <Spinner color="primary"></Spinner>
                    </td>
                  </tr>
                </tbody>
              </>
            ) : (
              <>
                {employeeList && employeeList.length > 0 ? (
                  <tbody className={"tbl-body"}>
                    {employeeList.map((employee, index) => {
                      return (
                        <tr className={"tbl-row"} key={index}>
                          <td className="tbl-col">{employee.employee_name}</td>
                          <td className={"tbl-col"}>{employee.phone_no}</td>
                          <td className={"tbl-col"}>{employee.sex}</td>
                          <td className={"tbl-col"}>{employee.state}</td>
                          <td className={"tbl-col"}>
                            <FiEdit2
                              onClick={() => editEmployee(employee, index)}
                              size={15}
                            />
                            <FiTrash2
                              onClick={() =>
                                deleteEmployee(index, employee._id)
                              }
                              size={15}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <tbody className="no-border">
                    <tr className="text-center">
                      <td colSpan={10} className="loaderDiv">
                        {showLoader ? (
                          <Spinner color="primary"></Spinner>
                        ) : (
                          "No data available."
                        )}
                      </td>
                    </tr>
                  </tbody>
                )}
              </>
            )}
          </Table>
        </CardBody>

        {employeeList && totalCount > filterBody.limit && (
          <CardFooter className="text-center">
            <Pagination style={{ justifyContent: "center" }}>
              <PaginationItem disabled={currentPage <= 1}>
                <PaginationLink
                  first
                  disabled={currentPage <= 1}
                  onClick={() => handlePagination(1)}
                />
              </PaginationItem>
              <PaginationItem disabled={currentPage <= 1}>
                <PaginationLink
                  previous
                  disabled={currentPage <= 1}
                  onClick={() => previousPage()}
                />
              </PaginationItem>
              {pageItems}
              <PaginationItem disabled={currentPage >= lastPage.current}>
                <PaginationLink
                  next
                  disabled={currentPage >= lastPage.current}
                  onClick={() => nextPage()}
                />
              </PaginationItem>
              <PaginationItem disabled={currentPage >= lastPage.current}>
                <PaginationLink
                  last
                  disabled={currentPage >= lastPage.current}
                  onClick={() => handlePagination(lastPage.current)}
                />
              </PaginationItem>
            </Pagination>
          </CardFooter>
        )}
      </Card>
    </>
  );
};

export default EmployeeDetailAction;
