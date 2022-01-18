import React, { useContext } from "react";
import { Card, Form, Input, Row, Col, Button, Select } from "antd";
import { TopicOption } from "./index";

const Publisher = ({ publish }) => {
    const [form] = Form.useForm();
    const topicOptions = useContext(TopicOption);

    const record = {
        topic: "testtopic/react",
        qos: 0,
    };

    const onFinish = (values) => {
        publish(values);
    };

    const PublishForm = (
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
                <Col span={24}>
                    <Form.Item label="Payload" name="payload">
                        <Input.TextArea />
                    </Form.Item>
                </Col>
                <Col span={8} offset={16} style={{ textAlign: "right" }}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Publish
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );

    return <Card title="Publisher">{PublishForm}</Card>;
};

export default Publisher;
