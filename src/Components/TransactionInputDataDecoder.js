import React from 'react';
import {
  Descriptions,
  message,
  Flex,
} from 'antd';

import { ethers } from 'ethers';

import BaseTxDecoder, {convertToString} from './BaseTxDecoder.js';


export default function Decode(props) {
  const [abiString, setAbiString] = React.useState();
  const [hexData, setHexData] = React.useState('');
  const [decodedResult, setDecodedResult] = React.useState([]);
  const [messageApi, contextHolder] = message.useMessage();


  const fields = [
    {placeholder: "input abi", onChang: event => setAbiString(event.target.value),  defaultValue: abiString,  getValue: () => abiString, rows: 3, cols: 100},
    {placeholder: "input transaction data", onChang: event => setHexData(event.target.value),  defaultValue: hexData,  getValue: () => hexData, rows: 3, cols: 100},
  ];


  function decodeTx() {
    try {
      const iface = new ethers.Interface(JSON.parse(abiString));
      const functionNameData = hexData.indexOf('0x') < 0 ? `0x${hexData.slice(0,8)}` : hexData.slice(0,10);
      const functionObj = iface.getFunction(functionNameData);
      const decoded = iface.decodeFunctionData(functionNameData, hexData.indexOf('0x') < 0 ? `0x${hexData}` : hexData);
      const decodedObj = decoded.toObject();
      console.log("RawTransactionDecoder.decodeTx ===>", "decodedObj:", decodedObj);

      let currentResult = [];
      currentResult.push({label: 'Method', children: functionObj.name});

      for (const paramType of functionObj.inputs) {
        const label = `${paramType.name} (${paramType.type})`; // 'uniqueID (bytes32)'
        const children = decodedObj[paramType.name]; // '0x6d4f1099163808d355d5d28eef93071b783cf35d5eb7caf60dca91f5d54e0029'
        currentResult.push({key: label, label, children: typeof(children) == "string" ? children : convertToString(children)});
      }
      setDecodedResult(currentResult);

    } catch (error) {
      setDecodedResult([]);
      console.error("RawTransactionDecoder.decodeTx ===>", "error:", error);
      messageApi.open({
        type: 'error',
        content: "decode transacton input data failed",
      });
    }
  }

  function showDecodedTx() {
    return (
      // <Descriptions title="Result" column={1} bordered={true}>
      <Descriptions key="transactionInputDataDecoder" column={1} bordered={true}>
        {
          decodedResult.map((item) => {
            return <Descriptions.Item labelStyle={{justifyContent: 'flex-end',minWidth:100}} span={1} key={item.key} label={item.label}>{item.children}</Descriptions.Item>;
          })
        }
      </Descriptions>
    );
  }

  return (
    <Flex vertical gap="small" style={{ width: '100%', height: '100%' }}>
      {contextHolder}
      <BaseTxDecoder fields={fields} decodeFunc={decodeTx} showResult={showDecodedTx}/>
    </Flex>
  );
}
