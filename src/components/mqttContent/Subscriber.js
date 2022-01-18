import React, { useContext } from "react";
import { Card, Form, Input, Row, Col, Button, Select } from "antd";
import { TopicOption } from "./index";

const Subscriber = ({ sub, unSub, showUnsub }) => {
    const [form] = Form.useForm();
    const topicOptions = useContext(TopicOption);

    const record = {
        topic: "transactions/buy",
    };

    const onFinish = (values) => {
        sub(values);
    };

    const handleUnsub = () => {
        const values = form.getFieldsValue();
        unSub(values);
    };

    const SubForm = (
        <Form
            layout="vertical"
            name="basic"
            form={form}
            initialValues={record}
            onFinish={onFinish}
        >
            <Row gutter={20}>
                <Col span={12}>
                    <Form.Item label="Topic Options" name="Topic Options">
                        <Select options={topicOptions} />
                    </Form.Item>
                </Col>
                <Col span={8} offset={16} style={{ textAlign: "right" }}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Subscribe
                        </Button>
                        {showUnsub ? (
                            <Button
                                type="danger"
                                style={{ marginLeft: "10px" }}
                                onClick={handleUnsub}
                            >
                                Unsubscribe
                            </Button>
                        ) : null}
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );

    return <Card title="Subscriber">{SubForm}</Card>;
};

export default Subscriber;
