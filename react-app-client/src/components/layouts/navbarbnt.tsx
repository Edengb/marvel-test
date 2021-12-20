import React from 'react';
import { Menu, Button } from 'antd';
import {useHistory}  from 'react-router';

const NavBarBnt = () => {
    const history = useHistory();

    const handleRegisterClick = () => {
        history.push('/createaccount');
    }
  return (
    <Button 
            onClick={handleRegisterClick}
            style={{float: 'right',
            marginTop: '15px',
            marginBottom: '20px',
            marginRight: '15px'}} type="default" htmlType="button">
        Register
    </Button>
  );
}

export default NavBarBnt;
