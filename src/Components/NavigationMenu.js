import {
  AppstoreOutlined,
  LinkOutlined,
  SettingOutlined,
  SendOutlined,
  TransactionOutlined,
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import { Breadcrumb, Layout, Divider, Menu, Switch } from 'antd';
import React, { useState } from 'react';
import DecoderRawTransaction from './DecoderRawTransaction.js';
import DecoderTransactionData from './DecoderTransactionData.js';

const { Header, Content, Sider } = Layout;

export default function NavigationMenu() {
  const [mode, setMode] = useState('inline');
  const [theme, setTheme] = useState('light');
  const [subPage, setSubPage] = useState(<></>);

  const changeMode = (value) => {
    setMode(value ? 'vertical' : 'inline');
  };

  const changeTheme = (value) => {
    setTheme(value ? 'dark' : 'light');
  };

  const keyDict = {
    "Transaction": "Transaction",
    "TransactionSend": "TransactionSend",
    "TransactionSendOnline": "TransactionSendOnline",
    "TransactionSendOffline": "TransactionSendOffline",
    "DecoderRawTransaction": "DecoderRawTransaction",
    "DecoderTransactionData": "DecoderTransactionData"
  }

  const pageDict = {
    "Decode": {
      key: "TransactionDecode",
      icon: <TransactionOutlined />,
      children: {
        "RawData": {
          // label:"RawData",
          key:keyDict.DecoderRawTransaction,
          icon: null,
          children: null,
        },
        "InputData": {
          // label:"InputData",
          key:keyDict.DecoderTransactionData,
          icon: null,
          children: null,
        },
      },
    }
  }
  const pageInfoDict = {
    "DecoderRawTransaction": <DecoderRawTransaction />,
    "DecoderTransactionData": <DecoderTransactionData />,
  }

  const onClick = ({ item, key, keyPath, domEvent }) => {
    console.log("item", item, "key", JSON.stringify(key), "keyPath:", keyPath, "domEvent:", domEvent)
    setSubPage(pageInfoDict[key]);
  };

  function getItem(label, key, icon, children, onHandleClick) {
    // // <Menu.Item label={label} key={key} icon={icon} children={children} onClick={onHandleClick}>
    // <Menu.Item label={label} key={key} icon={icon} children={children}>
    //   <PieChartOutlined />
    //   <span>label</span>
    // </Menu.Item>
    return {
      key,
      icon,
      children,
      label,
    };
  }

  // function getItems(label, itemDict) {
  //   let children = [];
  //   if (!itemDict.children || !itemDict.children.length) {
  //     return getItem(label, itemDict.key, itemDict.icon);
  //   }
  //   children.push(getItem(label, itemDict.key, itemDict.icon))
  //   return getItem(label, itemDict.key, itemDict.icon, itemDict);
  //   (itemDict)
  // }

  const items = [
    getItem('Transaction', keyDict.Transaction, <AppstoreOutlined />, [
      getItem('Send', keyDict.TransactionSend, <SendOutlined />, [
        getItem('send Transaction', keyDict.TransactionSendOnline),
        getItem('send Offline', keyDict.TransactionSendOffline),
      ]),
      getItem('Decode', keyDict.TransactionDecode, <TransactionOutlined />, [
        getItem("RawData", keyDict.DecoderRawTransaction, <SettingOutlined />),
        getItem("InputData", keyDict.DecoderTransactionData, <SettingOutlined />),
      ]),
    ]),
    getItem(
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        Ant Design
      </a>,
      'link',
      <LinkOutlined />,
    ),
  ];

  return (
  <Layout>
    <Header className="header">
      {/* <div className="logo" /> */}
      <Switch onChange={changeMode} /> Change Mode
        <Divider type="vertical" />
        <Switch onChange={changeTheme} /> Change Style
    </Header>
    <Layout>
      <Sider width={200} className="site-layout-background">
      <Menu
        style={{
          width: 256,
        }}
        defaultSelectedKeys={['Transaction']}
        defaultOpenKeys={['TransactionDecode']}
        mode={mode}
        theme={theme}
        items={items}
        onClick={onClick}
      />
      </Sider>
      <Layout
        // style={{
        //   padding: '0 24px 24px',
        // }}
      >
        {subPage}
      </Layout>
    </Layout>
  </Layout>
);

// const NavigationMenu = () => {
//   const [mode, setMode] = useState('inline');
//   const [theme, setTheme] = useState('light');

//   const changeMode = (value) => {
//     setMode(value ? 'vertical' : 'inline');
//   };

//   const changeTheme = (value) => {
//     setTheme(value ? 'dark' : 'light');
//   };

//   return (
//     <>
//       <Switch onChange={changeMode} /> Change Mode
//       <Divider type="vertical" />
//       <Switch onChange={changeTheme} /> Change Style
//       <br />
//       <br />
//       <Menu
//         style={{
//           width: 256,
//         }}
//         defaultSelectedKeys={['Transaction']}
//         defaultOpenKeys={['TransactionDecode']}
//         mode={mode}
//         theme={theme}
//         items={items}
//       />
//     </>
//   );
};

// export default NavigationMenu;