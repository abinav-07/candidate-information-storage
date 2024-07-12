import React, { useState } from "react"
import { Button, Layout, message, Modal, Table } from "antd"
import { Header } from "antd/lib/layout/layout"
import { Content } from "antd/es/layout/layout"
import { useMutation, useQuery } from "react-query"
import moment from "moment";

import { deleteCandidateProfile, fetchCandidates } from "@/services/candidates"
import Link from "next/link"
import PrivateRoute from "@/pages/privateRoute"
import { DeleteFilled } from "@ant-design/icons"

const CandidateList: React.FC = () => {
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number>(0);

    const {
        data: candidateList,
        isLoading,
        isFetching,
        refetch
    } = useQuery(["emails"], () => fetchCandidates(), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        enabled: true,
        retry: 2,
        cacheTime: 0,
        select: ({ data }) => {
            return {
                data: data?.map((values: any, i: number) => ({
                    ...values,
                    key: i,
                })),
            }
        },
    })


    const { mutate: deleteRow, isLoading: isDeleting } = useMutation(
        deleteCandidateProfile,
        {
            onSuccess: () => {
                // Refetch
                refetch();
                message.open({
                    type: "success",
                    content: "Successfully Deleted",
                });
            },
            onError: (err: any) => {
                message.open({
                    type: "error",
                    content: err?.response?.data?.message || "Error when deleting.",
                });
            },
        },
    );


    const handleCancel = () => {
        setShowDeleteModal(false);
    };

    const handleDelete = (id: number) => {
        deleteRow(id);
        setShowDeleteModal(false);
    };

    const columns = [
        {
            title: "Email",
            dataIndex: "email",
            width: "15%",
        },
        {
            title: "Full name",
            dataIndex: "full_name",
            width: "15%",
            render: (_: any, record: any) =>
                `${record?.first_name} ${record?.last_name}`,
        },
        {
            title: "Free text",
            dataIndex: "free_text",
            ellipsis: true,
            width: "15%",
        },
        {
            title: "Phone number",
            dataIndex: "phone_number",
            width: "10%",
        },
        {
            title: "Available From",
            dataIndex: "availability_start_time",
            width: "5%",
            render: (availability_end_time: any) => {
                return availability_end_time ? moment(availability_end_time, 'HH:mm:ss').format('h:mm A') : "-"
            }
        },
        {
            title: "Available To",
            dataIndex: "availability_end_time",
            width: "5%",
            render: (availability_end_time: any) => {
                return availability_end_time ? moment(availability_end_time, 'HH:mm:ss').format('h:mm A') : "-"
            }

        },
        {
            title: "Linkedin",
            dataIndex: "linkedin_url",
            width: "10%",
            render: (linkedin_url: any, record: any) => {
                return (
                    <Link href={linkedin_url} target="_blank" >
                        {record?.first_name}'s Linkedin URL
                    </Link>
                )
            }

        },
        {
            title: "Github",
            dataIndex: "github_url",
            width: "10%",
            render: (github_url: any, record: any) => {
                return (
                    <Link href={github_url} target="_blank" >
                        {record?.first_name}'s Github URL
                    </Link>
                )
            }
        },
        {
            title: "Created at",
            dataIndex: "created_at",
            key: "date",
            width: "10%",
            render: (_: any, record: any) =>
                `${record?.created_at ? new Date(record?.created_at)?.toISOString()?.split("T")?.[0] : "-"}`,
        },
        {
            title: "Action",
            dataIndex: "candidate_id",
            key: "candidate_id",
            width: "5%",
            align: "center" as "center",
            render: (id: number) => (
                <div style={{ textAlign: "center" }}>
                    <Button
                        type="primary"
                        danger
                        onClick={() => {
                            setDeleteId(id);
                            setShowDeleteModal(true);
                        }}
                    >
                        <DeleteFilled />
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <>
            <Layout>
                <Header style={{ background: "#fff" }}>
                    <h3>Candidates and their information</h3>
                </Header>
                <Content>
                    <Table
                        bordered
                        dataSource={candidateList?.data}
                        columns={columns}
                        loading={isLoading || isFetching || isDeleting}
                        pagination={false}
                    />
                </Content>
            </Layout>
            {showDeleteModal && (
                <Modal
                    title="Delete?"
                    open={showDeleteModal}
                    onOk={() => handleDelete(deleteId)}
                    onCancel={handleCancel}
                    maskClosable={true}
                    loading={isDeleting}
                />
            )}
        </>
    )
}

export default PrivateRoute(CandidateList)
