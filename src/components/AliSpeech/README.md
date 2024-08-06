
# AliSpeech


### 概述

对接阿里语音转换服务


### 示例

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _AliSpeech(@components/AliSpeech)

```jsx
const { default: AliSpeech } = _AliSpeech;
const BaseExample = () => {
  return <AliSpeech appKey="SmSM259tqeAbzP7J" taskId={AliSpeech.getUUID()} onComplete={(message) => {
    console.log(message);
  }} />;
};

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

