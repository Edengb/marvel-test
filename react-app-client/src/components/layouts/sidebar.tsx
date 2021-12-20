import React, {useEffect} from 'react';
import { Menu} from 'antd';
import {
    UserOutlined,
    DingdingOutlined,
    LoginOutlined,
  } from '@ant-design/icons';
import {useHistory}  from 'react-router';
import { IState as Props } from "../../config/ApplicationRoutes";

interface IProps {
    setAppProps: React.Dispatch<React.SetStateAction<Props["appProps"]>>
    appProps: Props["appProps"]
}
const SideNav: React.FC<IProps> = ({setAppProps, appProps}) => {
    let itemStyle = {
        pointerEvents: appProps.transactionItemPointerEvents
    }

    useEffect(() => {
        if(localStorage.getItem("user") && appProps.transactionItemPointerEvents !== "pointer") {
            setAppProps({isList: appProps.isList, contentStyleMinHeight: appProps.contentStyleMinHeight, transactionItemPointerEvents: "pointer", userName: appProps.userName, total: appProps.total}); 
        } else if(!localStorage.getItem("user") && appProps.transactionItemPointerEvents != "none") {
            setAppProps({isList: false, contentStyleMinHeight: appProps.contentStyleMinHeight, transactionItemPointerEvents: "none"});
        }
    });

    const history = useHistory();

    const handleUserClick = () => {
        if(localStorage.getItem("user")) 
            history.push('/list');
    }

    const handleLogOut = () => {
        localStorage.clear();
        history.push('/login');
    }
  return (
    <React.Fragment>
        <div style={{height: "32px", background: "url('https://www.nicepng.com/png/full/1-10313_latest-marvel-logo-marvel-avengers-xmen-logo-logan.png')", backgroundSize: "30px", backgroundPosition: "center", backgroundRepeat: "no-repeat", margin: "16px"}}></div>
        <Menu theme="dark" mode="inline" key={'1'} >
            <Menu.Item key="1" onClick={handleUserClick} style={itemStyle}>
                <DingdingOutlined />
                <span> My Characters</span>
            </Menu.Item>
            {appProps.userName && (
            <Menu.Item key="2" style={{ pointerEvents: 'none' }}>
                <UserOutlined />
                <span>{appProps.userName}</span>
                
            </Menu.Item>)}     
            {appProps.userName && (
            <Menu.Item key="3" onClick={handleLogOut} >
                <LoginOutlined />
                <span> Logout</span>
            </Menu.Item>)}
        </Menu>
    </React.Fragment>
  );
}

export default SideNav;
