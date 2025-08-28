import React from 'react';
import {
  Descriptions,
  message,
  Flex,
} from 'antd';

import { ethers } from 'ethers';
import * as rlp from 'rlp';
import { wanchainTx } from 'wanchain-util';

import BaseTxDecoder, {convertToString} from './BaseTxDecoder.js';


export default function Decoder() {
  const [hexRawData, setTxHexRawData] = React.useState(
    // '0xf902b30182c60c8a313030303030303030308339387094e5f6d7d42dcfb870eabcee51c6f1de18ea9efae630b9024449b7482b0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000004000000000000000000000000efcabfa21a5020380861b7c63fc9fe24f8aca743000000000000000000000000f7e4c49e131e8f3c1be100371d6ee7dcdc0b6bf600000000000000000000000089a26b2f0787675d56d8abaa5c855d0736e8a0600000000000000000000000009df54b4a4a58b71ffc9e9e996c8b56d8d459b04f00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000002d5d2644f9000000000000000000000000000000000000000000000000000000004a35bc2f0000000000000000000000000000000000000000000000000000000afe26b9a9000000000000000000000000000000000000000000000000000000192d6a220500000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000002b4d6affa1000000000000000000000000000000000000000000000000000000004521e6040000000000000000000000000000000000000000000000000000000aa096783200000000000000000000000000000000000000000000000000000019519b7e9c26a0649c9c7d609462f8bb6693f24d5631be612d92122c6d3ec4152239eae83eacaca06ff71dfc4d46dbbf0fc7c8f87e2c073773dff53b65db8ac3b1c077fde3c1802d' // wanchain legacy tx
    '0xf86e830c590f8502cb41780082f61894baf99ed5b5663329fa417953007afcc60f06f78187637aade5f00c008026a0235bbb2ffc4915daacee02a17d4527b688c853512776798756271d1a83c46ffaa079e2acba2ef48e510e9bef300e2ca79134869fa5775b2cec22eb4db09dd78164'
  );
  const [decodedResult, setDecodedResult] = React.useState([]);
  const [messageApi, contextHolder] = message.useMessage();


  const fields = [
    {placeholder: "input raw transaction data", onChang: event => setTxHexRawData(event.target.value),  defaultValue: hexRawData,  getValue: () => hexRawData, rows: 3, cols: 100},
  ];

  function decodeWanchainLegacyTx(raw){
    let rlp1 = rlp.decode(raw);
    if(rlp1.length == 10) {
      if(Buffer.from(rlp1[0]).toString('hex') === 'ffffffff') { // wanjupiter
        let rlp1 = rlp.decode(raw)
        let rlp2 = rlp1.slice(1)
        let raw3 = rlp.encode(rlp2)
        return  ethers.Transaction.from(raw3).toJSON();
      } else { //wan lagacy
        const tx = new wanchainTx(raw);
        let tx2 = tx.toJSON(true)
        tx2.from = '0x'+tx.from.toString('hex')
        return tx2;
      }
    } else {
      throw new error("unknown wanchain raw transaction data")
    }
  }

  function decodeTx() {
    try {
      let txObj;
      try {
        const tx = ethers.Transaction.from(hexRawData);
        txObj = tx.toJSON();
        txObj.from = tx.from;
      } catch (error) {
        txObj = decodeWanchainLegacyTx(hexRawData);
      }
      console.log("RawTransactionDecoder.decodeTx ===>", "txObj:", txObj);

      let currentResult = [];

      // {"type":0,"to":"0xbAF99eD5b5663329FA417953007AFCC60f06F781","data":"0x","nonce":809231,"gasLimit":"63000","gasPrice":"12000000000","maxPriorityFeePerGas":null,"maxFeePerGas":null,"value":"28000910000000000","chainId":"1","sig":{"_type":"signature","networkV":"38","r":"0x235bbb2ffc4915daacee02a17d4527b688c853512776798756271d1a83c46ffa","s":"0x79e2acba2ef48e510e9bef300e2ca79134869fa5775b2cec22eb4db09dd78164","v":28},"accessList":null}
      for (const key in txObj) {
        if (typeof(txObj[key]) == "object" && txObj[key]  && !Array.isArray(txObj[key])) {
          for (const subKey in txObj[key]) { // 
            if (subKey == "_type") {
              continue;
            }
            const label = subKey; // 'uniqueID (bytes32)'
            const children = txObj[key][subKey]; // '0x6d4f1099163808d355d5d28eef93071b783cf35d5eb7caf60dca91f5d54e0029'
            currentResult.push({key: label, label, children: typeof(children) == "string" ? children : convertToString(children)});
          }
        } else {
          const label = key; // 'uniqueID (bytes32)'
          const children = txObj[key]; // '0x6d4f1099163808d355d5d28eef93071b783cf35d5eb7caf60dca91f5d54e0029'
          currentResult.push({key: label, label, children: typeof(children) == "string" ? children : convertToString(children)});
        }
      }
      setDecodedResult(currentResult);

    } catch (error) {
      setDecodedResult([]);
      console.error("RawTransactionDecoder.decodeTx ===>", "error:", error);
      messageApi.open({
        type: 'error',
        content: "decode raw transacton failed",
      });
    }
  }

  function showDecodedTx() {
    return (
      // <Descriptions title="Result" column={1} bordered={true}>
      <Descriptions key="rawTransactionDataDecoder" column={1} bordered={true}>
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
