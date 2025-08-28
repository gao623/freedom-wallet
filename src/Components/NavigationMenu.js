import 'antd/dist/reset.css';
import {
  AppstoreOutlined,
  LinkOutlined,
  SettingOutlined,
  SendOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import { Layout, Divider, Menu, Switch, Flex } from 'antd';
import React from 'react';

import RawTransactionDecoder from './RawTransactionDecoder.js';
import TransactionInputDataDecoder from './TransactionInputDataDecoder.js';
import BaseTxDecoder from './BaseTxDecoder.js';

const { Header, Sider } = Layout;

const themeDict = {
  light: "light",
  dark: "dark",
}
const switchModeDict = {
  vertical: "vertical",
  inline: "inline",
}

export default function NavigationMenu() {
  const [mode, setMode] = React.useState(switchModeDict.inline);
  const [theme, setTheme] = React.useState(themeDict.light);
  const [subPage, setSubPage] = React.useState(<></>);

  const onChangeMode = (value) => {
    setMode(value ? switchModeDict.vertical : switchModeDict.inline);
  };

  const onChangeTheme = (value) => {
    setTheme(value ? themeDict.light : themeDict.dark);
  };

  const keyDict = {
    "Transaction": "Transaction",
    "TransactionSend": "TransactionSend",
    "TransactionSendOnline": "TransactionSendOnline",
    "TransactionSendOffline": "TransactionSendOffline",
    "RawTransactionDecoder": "RawTransactionDecoder",
    "TransactionInputDataDecoder": "TransactionInputDataDecoder",
    "BaseTxDecoder": "BaseTxDecoder",
  }

  const pageInfoDict = {
    "RawTransactionDecoder": <RawTransactionDecoder />,
    "TransactionInputDataDecoder": <TransactionInputDataDecoder />,
    "BaseTxDecoder": <BaseTxDecoder />,
  }

  const onClick = ({ item, key, keyPath, domEvent }) => {
    console.log("item", item, "key", JSON.stringify(key), "keyPath:", keyPath, "domEvent:", domEvent)
    setSubPage(pageInfoDict[key]);
  };

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  const items = [
    getItem('Transaction', keyDict.Transaction, <AppstoreOutlined />, [
      getItem('Send', keyDict.TransactionSend, <SendOutlined />, [
        getItem('send Transaction', keyDict.TransactionSendOnline),
        getItem('send Offline', keyDict.TransactionSendOffline),
      ]),
      getItem('Decode', keyDict.TransactionDecode, <TransactionOutlined />, [
        getItem("RawData", keyDict.RawTransactionDecoder, <SettingOutlined />),
        getItem("InputData", keyDict.TransactionInputDataDecoder, <SettingOutlined />),
        getItem("schema", keyDict.BaseTxDecoder, <SettingOutlined />),
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
    <>
      <Header className="header">
        {/* <div className="logo" /> */}
        <Switch checkedChildren={switchModeDict.vertical} unCheckedChildren={switchModeDict.inline} defaultChecked onChange={onChangeMode} />
        <Divider type={switchModeDict.vertical} />
        <Switch checkedChildren={themeDict.light} unCheckedChildren={themeDict.dark} defaultChecked onChange={onChangeTheme} />
      </Header>
      <Flex gap="small" style={{ width: '100%', height: '100%' }}>
        <Sider className="site-layout-background">
          <Menu
            defaultSelectedKeys={['Transaction']}
            defaultOpenKeys={['TransactionDecode']}
            mode={mode}
            theme={theme}
            items={items}
            onClick={onClick}
          />
        </Sider>
        {subPage}
      </Flex>
    </>
  );
};
