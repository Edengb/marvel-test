import React, {useState, useEffect} from 'react';
import {Row, Col, Typography, Input, Form, Button, 
Radio, Switch, Slider, Select, message, DatePicker, InputNumber, Upload} from 'antd';
import axios from 'axios';
import {useHistory} from 'react-router';
import { IState as Props } from "../../config/ApplicationRoutes";
import locale from 'antd/es/date-picker/locale/pt_BR';
import { UploadOutlined } from '@ant-design/icons';

const {Title} = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface IProps {
  setAppProps: React.Dispatch<React.SetStateAction<Props["appProps"]>>
  appProps: Props["appProps"]
}


const FormApp: React.FC<IProps> = ({setAppProps, appProps}) => {

  useEffect(() => {
    if (appProps.isList == true) {
      setAppProps({isList: false, contentStyleMinHeight: "calc(100vh - 114px)", userName: appProps.userName});
    }
  });


  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const handleSubmit = (values: any) => {

    setLoading(true);
    axios.post(`http://localhost:8080/api/v1/character`,
      values,
      {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem("user")}
      })
    .then(res => {
      setLoading(false);
      message.success('Character Added Successfully!');
    })
    .catch(error => {
      setLoading(false);
      message.error(error.response.data.message);
    })
  }

  return (
    <div>
      <Row gutter={[40, 0]}>
        <Col span={23}>
          <Title style={{textAlign: 'center'}} level={2}>Please Fill the Character Form</Title>
        </Col>
      </Row>
      <Row gutter={[40, 0]}>
        <Col span={18}>
          <Form {...layout} onFinish={handleSubmit}>
            <Form.Item name="modified" label="Modified"
              rules={[
                {
                  required: true,
                  message: 'Please input the modified date'
                }
              ]}>
              <DatePicker showTime   format="YYYY-MM-D HH:mm:ss" locale={locale} />
            </Form.Item>
            <Form.Item name="price" label="Price" 
              rules={[
                {
                  required: true,
                  message: 'Please input the character price',
                  type: 'number',
                  min: 0
                }
              ]}>
              <InputNumber
                defaultValue={0}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
            </Form.Item>
            <Form.Item name="description" label="Description"
              rules={[
                {
                  required: true,
                  message: 'Please input the character description',
                }
              ]}>
              <Input placeholder="Please Enter your description" />
            </Form.Item>
            <Form.Item name="thumbnail" label="thumbnail"
              rules={[
                {
                  required: true,
                  message: 'Please input the character thumbnail',
                }
              ]}>
              <Input placeholder="Please Enter your thumbnail src" />
            </Form.Item>
            <div style={{textAlign: "right"}}>
              <Button type="primary" loading={loading} htmlType="submit">
                Save
              </Button>{' '}
              <Button type="default" htmlType="button" onClick={() => history.push('/list')}>
                Back
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
  </div>
  );
}

export default FormApp;
