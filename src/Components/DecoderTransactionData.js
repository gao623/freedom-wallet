import React from 'react';
import {
  Button,
  Descriptions,
  Input,
} from 'antd';

import EthereumTools from 'ethereumTools';

export default function Decoder() {
  const [abi, setAbi] = React.useState();
  const [hexData, setHexData] = React.useState('');
  const [decodedData, setDecodedData] = React.useReducer(setDecodedDataDispatch, {});

  const txRawDataDecoder = new EthereumTools.TxInputDataDecoder();
  const onHandleHexDataChange = event => {
    console.log(event);
    setHexData(event.target.value);
  }
  const onHandleAbiChange = event => {
    setAbi(JSON.parse(event.target.value));
    // txRawDataDecoder.updateAbi(JSON.parse(event.target.value));
  }

  function setDecodedDataDispatch(state, action) {
    let reply = {};
    // {key:"xxx", data:"xxx"};
    reply[action.key] = action.data;
    return {...state, ...reply};
  }

  function decodeTx() {
    try {
      txRawDataDecoder.updateAbi(abi);
      const data = txRawDataDecoder.decode(hexData);
      console.log("decoded:", data);

      for (let key in data) {
        setDecodedData({key: key, data: data[key]});
      }
    } catch (error) {
      setDecodedData({error:error});
    }
  }

  function showDecodedTx() {
    let items = [];
    if (Object.keys)
    for (let key in decodedData) {
      if (Array.isArray(decodedData[key])) {
        const showData = decodedData[key].map(v => JSON.stringify(v)).join("\n");
        items.push(<Descriptions.Item labelStyle={{justifyContent: 'flex-end',minWidth:100}} contentStyle={{whiteSpace: "pre-line"}} label={key}>{showData}</Descriptions.Item>);
      } else if ((decodedData[key] && typeof(decodedData[key]) === "object")) {
        const keys = Object.keys(decodedData[key]);
        const validLength = decodedData[key].__length__;
        delete decodedData[key].__length__;

        if (keys.length > validLength) {
          console.log("should delete some index")
          if (decodedData[key] && keys.length) {
            for (let i = 0; i < validLength; i++) {
              delete decodedData[key][i.toString()];
            }
          }
        }
        const showData = Object.keys(decodedData[key]).map(innerKey => {
          let reply = {};
          reply[innerKey] = decodedData[key][innerKey];
          return JSON.stringify(reply);
        }).join("\n")
        items.push(<Descriptions.Item labelStyle={{justifyContent: 'flex-end',minWidth:100}} contentStyle={{whiteSpace: "pre-line"}} label={key}>{showData}</Descriptions.Item>);
      } else {
        items.push(<Descriptions.Item labelStyle={{justifyContent: 'flex-end',minWidth:100}} span={1} label={key}>{decodedData[key]}</Descriptions.Item>);
      }
    }
    return (
      // <Descriptions title="Result" column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }} bordered={true}>
      <Descriptions title="Result" column={1} bordered={true}>
        {items}
      </Descriptions>
    );
  }
  return (
    <>
      <Input.Group TxInputData>
      <Input.TextArea rows={3} cols={100} defaultValue={JSON.stringify(abi)} value={JSON.stringify(abi)} onChange={onHandleAbiChange} placeholder={"input abi"}/>
        {/* <Input style={{ width: 'calc(100% - 200px)' }} defaultValue={hexData} value={hexData} onChange={setHexData} /> */}
        <Input.TextArea rows={3} cols={100} defaultValue={hexData} value={hexData} onChange={onHandleHexDataChange} placeholder={"input transaction data"}/>
        {/* <Input style={{ width: 'calc(100% - 200px)', height:120 }} bordered={true} defaultValue={hexData} value={hexData} onChange={setHexData} /> */}
        <br/>
        <Button type="primary" shape="round" color="blue" size="large" display={"inline-block"} onClick = {decodeTx}>
          {/* <svg aria-hidden="true" viewBox="0 0 10 10"><path d="M7 9L5 8 3 9V6L1 4h3l1-3 1 3h3L7 6z"/></svg> */}
          Decode
        </Button>
      </Input.Group>
      {showDecodedTx()}
    </>
  );
}
