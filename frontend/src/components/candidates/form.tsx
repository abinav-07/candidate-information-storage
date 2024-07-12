import {
    fetchOneCandidate,
    updateCandidateProfile,
    upsertCandidateProfile,
} from "@/services/candidates"
import { ICreateCandidate } from "@/types/candidates"
import { Button, Form, Input, TimePicker, message } from "antd"
import TextArea from "antd/es/input/TextArea"
import moment from "moment"
import Router from "next/router"
import React, { useEffect } from "react"
import { useMutation, useQuery } from "react-query"

interface IProps {
    id?: string
}

const CandidateProfileForm: React.FC<IProps> = ({ id }) => {
    const [form] = Form.useForm()
    const availabilityStartWatch = Form.useWatch("availability_start_time", form)
    const availabilityEndWatch = Form.useWatch("availability_end_time", form)

    const {
        data: candidateData,
        isLoading: candidateDataLoading,
        isFetching: candidateDataFetching,
    } = useQuery<any, Error>(["getOneCandidate", id], () => id && fetchOneCandidate(Number(id)), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        cacheTime: 0,
        retry: 1,
        enabled: !!id,
    })


    const { mutate: create, isLoading: isCreating } = useMutation(upsertCandidateProfile, {
        onSuccess: () => {
            message.success({
                type: "success",
                content: "Successfully created.",
            })
            Router.push("/admin/candidates")
        },
        onError: (err: any) => {
            message.open({
                type: "error",
                content: err?.response?.data?.message || "Error when creating candidate profile.",
            })
        },
    })

    const { mutate: update, isLoading: isUpdating } = useMutation(updateCandidateProfile, {
        onSuccess: () => {
            message.success({
                type: "success",
                content: "Successfully updated.",
            })
            Router.push("/admin/candidates")
        },
        onError: (err: any) => {
            message.open({
                type: "error",
                content: err?.response?.data?.message || "Error when updating candidate profile.",
            })
        },
    })

    const handleSubmit = async (values: ICreateCandidate) => {
        // Update if id found i.e edit page
        if (id) {
            update({
                candidate_id: Number(id),
                ...values,
                availability_start_time: values.availability_start_time
                    ? moment(new Date(values.availability_start_time)).format("HH:mm")
                    : "",
                availability_end_time: values.availability_end_time
                    ? moment(new Date(values.availability_end_time)).format("HH:mm")
                    : "",
            })
        } else {
            create({
                ...values,
                availability_start_time: values.availability_start_time
                    ? moment(new Date(values.availability_start_time)).format("HH:mm")
                    : "",
                availability_end_time: values.availability_end_time
                    ? moment(new Date(values.availability_end_time)).format("HH:mm")
                    : "",
            })
        }
    }

    const initialData = candidateData?.data || {
        first_name: "",
        last_name: "",
        email: "",
        free_text: "",
        phone_number: "",
        linkedin_url: "",
        github_url: "",
        availability_start_time: "",
        availability_end_time: "",
    }

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                ...initialData,
                availability_start_time: initialData.availability_start_time ? moment(initialData.availability_start_time, "HH:mm") : null,
                availability_end_time: initialData.availability_end_time ? moment(initialData.availability_end_time, "HH:mm") : null,
            });
        }
    }, [initialData]);


    return (
        <>
            <Form
                id="form"
                labelCol={{ xs: { span: 24 }, md: { span: 4 }, lg: { span: 8 } }}
                wrapperCol={{ span: 20 }}
                name="form"
                layout="horizontal"
                colon={false}
                form={form}
                onFinish={handleSubmit}
                initialValues={initialData}
            >
                <Form.Item
                    label="First Name"
                    name="first_name"
                    rules={[{ required: true, message: "Please enter first name!" }]}
                >
                    <Input placeholder="Enter first name" />
                </Form.Item>

                <Form.Item
                    label="Last Name"
                    name="last_name"
                    rules={[{ required: true, message: "Please enter last name!" }]}
                >
                    <Input placeholder="Enter last name" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Please enter valid email!" }]}
                >
                    <Input placeholder="Enter email" />
                </Form.Item>
                <Form.Item
                    label="Free text"
                    name="free_text"
                    rules={[{ required: true, message: "Enter Free text!" }]}
                >
                    <TextArea placeholder="Enter free text" />
                </Form.Item>
                <Form.Item label="Phone number" name="phone_number">
                    <Input placeholder="Enter phone number" />
                </Form.Item>
                <Form.Item label="LinkedIn URL" name="linkedin_url">
                    <Input placeholder="Enter LinkedIn URL" />
                </Form.Item>
                <Form.Item label="Github URL" name="github_url">
                    <Input placeholder="Enter Github URL" />
                </Form.Item>
                <Form.Item label="Availability Time" className="availability_time">
                    <Form.Item
                        name="availability_start_time"
                        className="availability_start_time"
                        rules={[{ required: !!availabilityEndWatch, message: "Please enter start time!" }]}
                    >
                        <TimePicker showSecond={false} />
                    </Form.Item>
                    ~
                    <Form.Item
                        name="availability_end_time"
                        className="availability_end_time"
                        rules={[{ required: !!availabilityStartWatch, message: "Please enter end time!" }]}
                    >
                        <TimePicker
                            disabled={!availabilityStartWatch}
                            showSecond={false} />
                    </Form.Item>
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        xs: { offset: 0, span: 8 },
                        md: { span: 3 },
                    }}
                    style={{ textAlign: "center" }}
                >
                    <Button
                        key={"submit"}
                        type="primary"
                        form="form"
                        loading={isCreating || isUpdating || candidateDataLoading || candidateDataFetching}
                        className={"form-submit"}
                        htmlType="submit"
                    >
                        {id ? "Update Profile" : "Create Profile"}
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default CandidateProfileForm
