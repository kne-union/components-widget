
# Speech


### 概述

用户处理语音识别，语音转文字等，对接阿里的智能语音交互服务


### 示例

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _Speech(@components/Speech)

```jsx
const { default: Speech, AudioRecordButton, AudioPlayerButton } = _Speech;
const { useState } = React;
const BaseExample = () => {
  const [record, setRecord] = useState(null);
  return <>
    <AudioRecordButton onStart={() => {
      setRecord(null);
    }} onComplete={(chunks) => {
      setRecord(new Blob(chunks, { type: chunks[0].type }));
    }} />
    {record && <AudioPlayerButton src={record} />}
  </>;
};

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

