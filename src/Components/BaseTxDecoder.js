import {
  Button,
  Space,
  Input,
  Flex,
} from 'antd';
import { ethers } from 'ethers';
import { RetweetOutlined } from '@ant-design/icons';


export default function Decode(props) {
  if (!props.fields) {
    return null;
  }

  console.log("BaseTxDecoder ===>", "props.fields:", props.fields);

  return (
    <>
      {
        props.fields.map((field, index) => {
          return <Input.TextArea key={index} rows={field.rows} cols={field.cols} defaultValue={field.defaultValue} value={field.getValue()} onChange={field.onChang} placeholder={field.placeholder}/>;
        })
      }
      <Button type="primary" shape="default" icon={<RetweetOutlined />}  onClick = {props.decodeFunc} ghost>
        {/* <svg aria-hidden="true" viewBox="0 0 10 10"><path d="M7 9L5 8 3 9V6L1 4h3l1-3 1 3h3L7 6z"/></svg> */}
        Decode
      </Button>
      {props.showResult()}
    </>
  );
}

export function formatData(object) {
    if (object.hasOwnProperty("__length__")) {
        for (let i = 0; i < object.__length__; ++i) {
            delete object[i];
        }
        delete object["__length__"];
    }
    for (let key in object) {
        if (typeof(object[key]) === 'object' && !Array.isArray(object[key])) {
            object[key] = formatData(object[key]);
            if (typeof(object[key]) === 'object' && !Array.isArray(object[key])) {
                object[key] = Object.entries(object[key]);
            }
        }
    }
    return (typeof(object) === 'object' && !Array.isArray(object)) ? Object.entries(object) : object;
}

// export function formatData(object) {
//   if (object.hasOwnProperty("__length__")) {
//     for (let i = 0; i < object.__length__; ++i) {
//       delete object[i];
//     }
//     delete object["__length__"];
//   }
//   for (let key in object) {
//     if (typeof object[key] === 'object') {
//       object[key] = formatData(object[key]);
//     }
//   }
//   return object;
// }

export function getError(err) {
  let errorInfo = err;
  if (err.cause) {
    errorInfo = err.cause;
  } else if (err.error && typeof(err.error) === "string") {
    errorInfo = err.error;
  } else if (err.error && err.error.details && err.error.details.length && err.error.details[0].message) {
    errorInfo = err.error.details[0].message;
  } else if (err.response && err.response.data && err.response.data.error) {
    errorInfo = err.response.data.error;
  } else if (err.processed && err.processed.except && err.processed.except.message) {
    errorInfo = err.processed.except.message;
  } else if (err.message) {
    errorInfo = err.message;
  } else if (err.name) {
    errorInfo = err.name;
  } else if (err.code) {
    errorInfo = err.code;
  } else {
    errorInfo = JSON.stringify(errorInfo);
  }
  if (typeof(errorInfo) !== "string") {
    return JSON.stringify(errorInfo);
  }
  return errorInfo;
}

export function convertToString(obj) {
  if (obj === null) {
    return "null";
  }

  // process String
  if (typeof obj === 'string') {
    return obj;
  }
  // process ethers.Result (Tuple)
  if (obj instanceof ethers.Result) {
    return JSON.stringify(obj.toArray().map(item => convertToString(item)));
  }
  // process Array
  if (Array.isArray(obj)) {
    return JSON.stringify(obj.map(item => convertToString(item)));
  }

  // process Buffer
  if (obj.type === 'Buffer' && obj.data !== undefined) {
    const hex = obj.toString('hex');
    return hex.indexOf("0x") < 0 ? `0x${hex}` : hex;
  }

  // process BigInt
  if (typeof obj === 'bigint') {
    return obj.toString(10);
  }
  // process Number
  if (typeof obj === 'number') {
    return obj.toString(10);
  }
  // process Boolean
  if (typeof obj === 'boolean') {
    return obj.toString();
  }

  // process Object
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'bigint') {
      result[key] = value.toString();
    } else if (value && value.type === 'Buffer' && value.data !== undefined) {
      result[key] = value.toString('hex');
    } else if (typeof value === 'object' && value !== null) {
      result[key] = convertToString(value);
    } else if (typeof value === 'boolean') {
      result[key] = value.toString();
    } else {
      result[key] = value;
    }
  }

  return result;
}
