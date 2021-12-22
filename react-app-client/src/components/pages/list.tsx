import React, {useEffect, useState, useContext, useCallback} from 'react';
import {Table, Row, Col, Button, Typography,Input, Space, DatePicker, InputNumber, Form, Modal, message, Popconfirm, Upload   } from 'antd';
import {useHistory} from 'react-router';
import { AudioOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { IState as Props } from "../../config/ApplicationRoutes";
import axios from 'axios';
import locale from 'antd/es/date-picker/locale/pt_BR';
import crypto from "crypto";
import { isNull } from 'util';


const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1890ff',
    }}
  />
);


const {Title} = Typography;

interface IProps {
  setAppProps: React.Dispatch<React.SetStateAction<Props["appProps"]>>
  appProps: Props["appProps"]
}



const List: React.FC<IProps> = ({setAppProps, appProps}) => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [trId, setTrId] = useState("");


  const history = useHistory();
  const [allData, setAllData] = useState([]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const showModal = (e:any) => {
    setTrId(e.target.getAttribute("id"))
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  const confirm = (e:any, record:any) => {
    const characterPrice = parseFloat(record.price.replace("$", ""));
    const atualPrice:number = (appProps.total) ? appProps.total : 0;
    console.log();
    axios.delete(`http://localhost:8080/api/v1/character/${record.id}`,
      {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem("user")}
      })
    .then(res => {
      message.warn('Character was deleted successfully!');
      axios.get(`http://localhost:8080/api/v1/character`, { 'headers': { 'Authorization': 'Bearer ' + localStorage.getItem("user")} })
      .then(res => {
          console.log(res);
          console.log(appProps.total);
          setAppProps({isList: true, contentStyleMinHeight: "calc(89vh - 114px)", userName: appProps.userName, total: (res.data.total <= atualPrice) ? res.data.total - characterPrice: appProps.total });
          setAllData(res.data.records);
      })
      .catch(error => {
        message.error("Algo deu errado: " + error.response.data.message);
      })
    })
    .catch(error => {
      message.error('Character was not deleted, try later: ' + error.response.data.message);
    })
  };

  const cancel = (e:any) => {
    message.error('Cancel Delete');
  };

  useEffect(() => {
    if (appProps.isList == false) {
      setAppProps({isList: true, contentStyleMinHeight: "calc(89vh - 114px)"});
      let user  = localStorage.getItem("user");
      axios.get(`http://localhost:8080/api/v1/auth`, { 'headers': { 'Authorization': 'Bearer ' + user} })
      .then(res => {
        setAppProps({isList: true, contentStyleMinHeight: "calc(89vh - 114px)", userName: res.data.name});
        let userName =res.data.name;
        axios.get(`http://localhost:8080/api/v1/character`, { 'headers': { 'Authorization': 'Bearer ' + user} })
        .then(res => {
          if(res.data.length != 0) {
            setAppProps({isList: true, contentStyleMinHeight: "calc(89vh - 114px)", userName: userName, total: res.data.total});
            setAllData(res.data.records);
          }
        })
        .catch(error => {
          message.error("Algo deu errado: " + error.response.data.message)
        })
      })
      .catch(error => {
        history.push("/");
      })
    }
  });

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Modified',
      dataIndex: 'modified',
    },
    {
      title: 'Price',
      dataIndex: 'price'
    },
    {
      title: 'Description',
      dataIndex: 'description'
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      render:  (theImageURL:any)  =>  <img  style={{
        width: "50%"
      }} alt={theImageURL} src={theImageURL} />
    },
    {
      key: 'id',
      dataIndex: 'edit',
      render: (value:any, row:any, index:any) => (
      <React.Fragment>
        <Button type="primary"  className="edit-btn" onClick={showModal} id={row.id}>
          {"Edit"}
        </Button>
        <Modal 
          title="Edit Character" 
          visible={isModalVisible} 
          onCancel={handleCancel}
          okButtonProps={{form:'category-editor-form', htmlType: 'submit', style: { display: 'none' } }}>
          <Form  id='category-editor-form' {...layout} onFinish={(data:any) => {

            console.log("Chamando o btn aqui!!");
            console.log(trId);
            axios.put(`http://localhost:8080/api/v1/character/${trId}`, data,
              {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem("user")}
              }
            )
            .then(res => {
              message.success('Character was edited successfully!');
              axios.get(`http://localhost:8080/api/v1/character`, { 'headers': { 'Authorization': 'Bearer ' + localStorage.getItem("user")} })
              .then(res => {
                setAppProps({isList: true, contentStyleMinHeight: "calc(89vh - 114px)", userName: appProps.userName, total: res.data.total});
                setAllData(res.data.records);
                setIsModalVisible(false);
              })
              .catch(error => {
                message.error("Algo deu errado: " + error.response.data.message)
              })
            })
            .catch(error => {
              message.error('Character was not edited, try later: ' + error.response.data.message);
              setIsModalVisible(true);
            })
          }}>
            <Form.Item name="modified" label="Modified">
              <DatePicker showTime   format="YYYY-MM-D HH:mm:ss" locale={locale} />
            </Form.Item>
            <Form.Item name="price" label="Price">
              <InputNumber formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input   />
            </Form.Item>
            <Form.Item name="thumbnail" label="Thumbnail">
              <Input   />
            </Form.Item>
            
            <Button type="primary"  htmlType="submit"> 
              Save
            </Button>
          </Form>
        </Modal>
      </React.Fragment>),
    },
    {
      key: 'key',
      dataIndex: 'delete',
      render: (text:any, record:any) => (
        <Popconfirm
          title="Are you sure to delete this task?"
          onConfirm={(e) => {
            confirm(e, record)
          }}
          onCancel={cancel}
          okText="Yes"
          cancelText="No">
          <Button type="primary" danger id={record.id} >
              {"Delete"}
          </Button>
        </Popconfirm>
       
      ),
    }
  ];

  const data:any[] = [];

  allData.map((user: any) => {
    data.push({
     key: user["_id"],
     id: user["_id"],
     modified: new Date(user.modified).toLocaleString(),
     price: "$" + user.price,
     description: user.description,
     thumbnail: user.thumbnail,
   })
   return data;
 });

  const handleClickMarvelAPI = () => {
    const publicKey = "0535ed9d59f604c30b73e83e53e973dc";
    const privateKey = "d521fb70c0602f219348c088cba0d0dcdeee5351";
    const ts = Date.now();



    axios.get(`http://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${crypto.createHash('md5').update(`${ts}${privateKey}${publicKey}`).digest('hex')}`)
    .then(resp => {
      
      const results:[{ modified: Date,
                       prices: [{price: string}], 
                       thumbnail: {extension: string, path: string}
                       description: string,
                       dates: [{date: Date}]}] = resp.data.data.results;

              
      const characters:any = results.map(character => {
        const requestPayload = {
          modified: (new Date(character.modified).toString() === "Invalid Date") ? Date.now(): character.modified,
          price: character.prices[0].price,
          thumbnail: `${character.thumbnail.path}.${character.thumbnail.extension}`,
          description: (character.description == "" || isNull(character.description)) ? "#N/A" :  character.description 
        };

        axios.post(`http://localhost:8080/api/v1/character`,
        requestPayload,
        {
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem("user")}
        })
        .then(res => {
          console.log(character.modified);
          message.success('Character Added Successfully!');
          
        })
        .catch(error => {
          console.log(new Date(character.modified).toString() === "Invalid Date" );
          message.error(error.response.data.message);
        })
    
        return requestPayload;
      });

      setAllData(characters);

    })
    .catch(err => {
      message.error("Algo deu errado: " + err.response.data.message)
    });

  }

  const handleClick = () => {
    history.push('/form')
  }

  const handleFilterClick = (value:any) => {
    let filterString = "";

    if(typeof value.price == "undefined")
      delete value.price;
    else 
      filterString += "price=" + value.price;

    if(typeof value.description == "undefined")
      delete value.description;
    else
      filterString += "&description=" + value.description;

    if(typeof value.modified == "undefined")
      delete value.modified;
    else
      filterString += "&modified=" + value.modified.toISOString();

    if(filterString != "") {

      axios.get(`http://localhost:8080/api/v1/character?${filterString}`, { 'headers': { 'Authorization': 'Bearer ' +  localStorage.getItem("user")} })
        .then(res => {
          setAppProps({isList: true, contentStyleMinHeight: "calc(89vh - 114px)", userName: appProps.userName, total: res.data.total});
          setAllData(res.data.records);
        })
        .catch(error => {
          message.error("Algo deu errado: " + error.response.data.message)
        })

    }
  }

  return (
    <React.Fragment>
      <Row gutter={[40, 0]}>
        <Col span={8}>
          <Title level={2}>My Character List</Title>
        </Col>
        <Col span={16}>
          <Space direction="vertical">
            <Form onFinish={handleFilterClick} style={{marginBottom: "-4%"}}>
              <Input.Group compact>
                <Form.Item 
                  style={{ width: '15%' }}
                  name="price"
                  rules={[
                    {
                      required: false
                    }
                  ]}>
                  <InputNumber
                    formatter={value => `$ ${value || 1000}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={ (value:any) => value.replace(/\$\s?|(,*)/g, '')}/>
                </Form.Item>
                <Form.Item 
                  style={{ width: '35%', marginRight: "-5%" }}
                  name="modified"
                  rules={[
                    {
                      required: false
                    }
                  ]}> 
                  <DatePicker showTime   format="YYYY-MM-D HH:mm:ss" locale={locale} />
                </Form.Item>
                <Form.Item 
                  style={{ width: '38%' }}
                  name="description"
                  rules={[
                    {
                      required: false
                    }
                  ]}>
                  <Input  placeholder="Description"   />
                </Form.Item>
                
                
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{justifyContent: 'center', alignItems: 'center'}}>
                  Search
                </Button>
              </Input.Group>  
            </Form>
            <div>
              <Button type="primary" style={{ width: '35%', display: "inline-block"}}   onClick={handleClick} >Add Character</Button>
              <Button type="primary" style={{ width: '35%', display: "inline-block", float: "right"}}  onClick={handleClickMarvelAPI}>
                    Getting Some Hereos
              </Button>
            </div>
          </Space>
        </Col>
      </Row>
      <Row gutter={[40, 0]}>
        <Col span={24}>
          <Table columns={columns} dataSource={data} pagination={{ pageSize: 3 }} rowKey='id' />
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default List;