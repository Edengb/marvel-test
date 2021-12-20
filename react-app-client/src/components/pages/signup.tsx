import React, {useState, useEffect} from 'react';
import {Row, Col, Typography, Input, Form, Button, message, DatePicker} from 'antd';
import axios from 'axios';
import {useHistory} from 'react-router';
import { IState as Props } from "../../config/ApplicationRoutes";


const {Title} = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface IProps {
  setAppProps: React.Dispatch<React.SetStateAction<Props["appProps"]>>
  appProps: Props["appProps"]
}


const SignUp: React.FC<IProps> = ({setAppProps, appProps}) => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (appProps.isList == true) {
      setAppProps({isList: false, contentStyleMinHeight: "calc(100vh - 114px)"});
      if(localStorage.getItem("user")) {
        setAppProps({isList: false, contentStyleMinHeight: "calc(89vh - 114px)", userName: appProps.userName});
      }
    }

    
  });


  
  const handleSubmit = (values: any) => {
    console.log(values);
    setLoading(true);
    axios.post(`http://localhost:8080/api/v1/user`, 
      values
    )
    .then(res => {
      setLoading(false);
      message.success('User Added Successfully!');
    })
    .catch(error => {
      setLoading(false);
      message.error(error.response.data.message);
    })
  }

  return (
    <React.Fragment>
        <Row gutter={[40, 0]}>
          <Col span={23}>
            <Title style={{textAlign: 'center'}} level={2}>
              Please Fill the Register Form
            </Title>
          </Col>
        </Row>
        <Row gutter={[40, 0]}>
          <Col span={18}>
            <Form {...layout} onFinish={handleSubmit}>
              <Form.Item 
                name="login" 
                label="Login"
                rules={[
                  {
                    required: true,
                    message: 'Please input your login',
                  }
                ]}>
                <Input placeholder="Please Enter your Login" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Password',
                  }
                ]}>
                <Input.Password placeholder="Please Enter your password" />
              </Form.Item>
              <Form.Item name="email" label="Email" 
                rules={[
                  {
                    required: true,
                    message: 'Please input your correct email',
                    type: 'email'
                  }
                ]}>
                <Input placeholder="Please Enter your email" />
              </Form.Item>
              <Form.Item 
                name="name" 
                label="Name"
                rules={[
                  {
                    required: true,
                    message: 'Please input your name',
                  }
                ]}>
                <Input placeholder="Please Enter your name" />
              </Form.Item>
              <div style={{textAlign: "right"}}>
                <Button type="primary" loading={loading} htmlType="submit">
                  Create User
                </Button>{' '}
                <Button type="default" htmlType="button" onClick={() => {
                  if(appProps.userName) 
                      history.push('/list')
                  else 
                      history.push('/login')
                  }}>
                    Back
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
    </React.Fragment>
  );
}

export default SignUp;
