import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import List from "../components/pages/list";
import Form from "../components/pages/form";
import SignUp from "../components/pages/signup";
import Login from "../components/pages/login";
import SideNav from "../components/layouts/sidebar";
import NavBarBnt from "../components/layouts/navbarbnt";
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import {
  TransactionOutlined
} from '@ant-design/icons';

import { Layout, Button } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined
  } from '@ant-design/icons';


  
const { Header, Sider, Content} = Layout;

export interface IState {
  appProps: {
    isList: boolean,
    contentStyleMinHeight: string,
    userName?: string,
    transactionItemPointerEvents?: any,
    total?:number,
    balance?: number
  } 
}






const ApplicationRoutes = () => {
  const [collapse, setCollapse] = useState(false);
  const [appProps, setAppProps] = useState<IState["appProps"]>({isList: false, contentStyleMinHeight: "calc(100vh - 114px)"})

  let contentStyle:any = {
    margin: '24px 16px', 
    padding: 24, 
    minHeight: appProps.contentStyleMinHeight, 
    background: "#fff"
  }

  useEffect(() => {
    window.innerWidth <= 760 ? setCollapse(true) : setCollapse(false);
  }, []);


 


  const handleToggle = (event: any) => {
      event.preventDefault();
      collapse ? setCollapse(false) : setCollapse(true);
  }

  return (
      <Router>
        <Layout>
          <Sider trigger={null} collapsible collapsed={collapse}>
            <SideNav appProps={appProps} setAppProps={setAppProps}/>
          </Sider>
          <Layout>
            <Header className="siteLayoutBackground" style={{padding: 0, background: "#001529"}}>
              {React.createElement(collapse ? MenuUnfoldOutlined : MenuFoldOutlined, {
                  className: 'trigger',
                  onClick: handleToggle,
                  style: {color: "#fff"}
              })}
              <NavBarBnt />
            </Header>
              <Content style={contentStyle}>
                <Switch>
                  <Route path="/login">
                      <Login appProps={appProps} setAppProps={setAppProps} />
                  </Route>
                  <Route path="/list">
                      <List appProps={appProps} setAppProps={setAppProps} />
                  </Route>
                  <Route path="/form">
                      <Form appProps={appProps} setAppProps={setAppProps} />
                  </Route>
                  <Route path="/createaccount">
                      <SignUp appProps={appProps} setAppProps={setAppProps} />
                  </Route>
                </Switch>      
              </Content>
              {appProps.isList && (
                <FooterToolbar extra="" style={{background: "rgba(255, 255, 255,  0.85)", textAlign: "center" }}>
                  <span style={{fontSize: "45px", color: "rgb(0, 0, 0)"}}><TransactionOutlined style={{width: "50px", fontSize: "45px"}} /> ${appProps.total} </span>
                </FooterToolbar>
              )}
              
          </Layout>
          
        </Layout>
        <Redirect
            to={{
              pathname: "/login"
            }}
          />
    </Router>
  );
}


export default ApplicationRoutes;