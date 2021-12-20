import React, {useState, useEffect} from 'react';
import {Row, Col, Typography, Input, Form, Button, 
Radio, Switch, Slider, Select, message, DatePicker} from 'antd';
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

const Login: React.FC<IProps> = ({setAppProps, appProps}) => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();


  useEffect(() => {
    if (appProps.isList == true) {
      setAppProps({isList: false, contentStyleMinHeight: "calc(100vh - 114px)"});
    }
  });

  const handleSubmit = (values: any) => {
    setLoading(true);
    axios.post(`http://localhost:8080/api/v1/auth`, 
      values
    )
    .then(res => {
      setLoading(false);
      localStorage.setItem("user", res.data.accessToken);
      setAppProps({isList: false, contentStyleMinHeight: "calc(100vh - 114px)", userName: res.data.accessToken});
      history.push("/list");
    })
    .catch(error => {
      setLoading(false);
      message.error(error.response.data.message);
    })
  }

  return (
    <React.Fragment>
        <Row gutter={[40, 0]} style={{marginTop: "0%"}}>
          <Col span={23}>
            <Title style={{textAlign: 'center'}} level={2}>
            Gerenciador Financeiro 
            </Title>
            <br/>
            <br/>
            <br/>
            </Col>
        </Row>
        <Row gutter={[40, 0]}>
        <Col span={18}>
          <Form {...layout} onFinish={handleSubmit}>
            <Form.Item name="login" label="Login"
            rules={[
              {
                required: true,
                message: 'Please input your login',
              }
            ]}
            >
              <Input placeholder="Please Enter your Login" />
            </Form.Item>
            <Form.Item name="password" label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your Password',
              }
            ]}
            >
               <Input.Password placeholder="Please Enter your password"
               
               />
            </Form.Item>
            <div style={{textAlign: "right"}}>
            <Button type="primary" style={{width: "67%", fontWeight: "bold", fontSize: "16px"}} loading={loading} htmlType="submit">
              Login
            </Button>{' '}
              </div>
          </Form>
          </Col>
        </Row>
    </React.Fragment>
  );
}

export default Login;
