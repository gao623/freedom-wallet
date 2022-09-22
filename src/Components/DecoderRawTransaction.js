import React from 'react';
import {
  Button,
  Descriptions,
  Input,
} from 'antd';

import EthereumTools from 'ethereumTools';

export default function Decoder() {
  const [hexRawData, setTxHexRawData] = React.useState(
    '0xf86e830c590f8502cb41780082f61894baf99ed5b5663329fa417953007afcc60f06f78187637aade5f00c008026a0235bbb2ffc4915daacee02a17d4527b688c853512776798756271d1a83c46ffaa079e2acba2ef48e510e9bef300e2ca79134869fa5775b2cec22eb4db09dd78164'
  );
  const [decodedData, setDecodedData] = React.useReducer(setDecodedDataDispatch, {});

  const txRawDataDecoder = new EthereumTools.TxRawDataDecoder();

  const onHandleChange = event => {
    console.log(event);
    setTxHexRawData(event.target.value);
  }

  function setDecodedDataDispatch(state, action) {
    let reply = {};
    // {key:"xxx", data:"xxx"};
    reply[action.key] = action.data;
    return {...state, ...reply};
  }

  function decodeTx() {
    try {
      const data = txRawDataDecoder.decode(hexRawData);

      for (let key in data) {
        setDecodedData({key: key, data: data[key]});
      }
    } catch (error) {
      setDecodedData({error:error});
    }
  }

  function showDecodedTx() {
    let items = [];
    for (let key in decodedData) {
      items.push(<Descriptions.Item labelStyle={{justifyContent: 'flex-end',minWidth:100}} span={1} label={key}>{decodedData[key]}</Descriptions.Item>);
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
      <Input.Group TxRawDataInput>
        {/* <Input style={{ width: 'calc(100% - 200px)' }} defaultValue={hexRawData} value={hexRawData} onChange={setTxHexRawData} /> */}
        <Input.TextArea rows={3} cols={100} defaultValue={hexRawData} value={hexRawData} onChange={onHandleChange} placeholder={"input raw transaction data"}/>
        {/* <Input style={{ width: 'calc(100% - 200px)', height:120 }} bordered={true} defaultValue={hexRawData} value={hexRawData} onChange={setTxHexRawData} /> */}
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
