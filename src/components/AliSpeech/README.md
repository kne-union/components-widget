
# AliSpeech


### 概述

对接阿里语音转换服务


### 示例

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _AliSpeech(@components/AliSpeech),antd(antd),remoteLoader(@kne/remote-loader)

```jsx
const { createWithRemoteLoader } = remoteLoader;
const { default: AliSpeech, AliSpeechRender } = _AliSpeech;
const { Button, Alert, Space } = antd;
const { useState } = React;
const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:Global@usePreset', 'components-core:InfoPage', 'components-core:FormInfo', 'components-core:Descriptions']
})(({ remoteModules }) => {
  const [PureGlobal, usePreset, InfoPage, FormInfo, Descriptions] = remoteModules;
  const { useFormModal, fields } = FormInfo;
  const { Input } = fields;
  const formModal = useFormModal();
  const { ajax } = usePreset();
  const [params, setParams] = useState(null);
  const ajaxForm = async ({ data }) => {
    console.log(data);
    return {
      data: {
        code: 0, data: { id: '111111' }
      }
    };
  };
  return <PureGlobal preset={{
    ajax, ajaxForm, apis: {
      ossUpload: ajaxForm, aliSpeech: {
        getToken: {
          loader: async () => {
            return params;
          }
        }
      }
    }
  }}>
    <InfoPage>
      <InfoPage.Part title="先在这里设置token">
        <InfoPage.Part>
          {params && <Descriptions
            dataSource={[[{ label: 'appKey', content: params.appKey }], [{
              label: 'token', content: params.token
            }]]} />}
        </InfoPage.Part>
        <InfoPage.Part>
          <Button onClick={() => {
            const formModalApi = formModal({
              title: '设置token',
              size: 'small',
              formProps: {
                data: Object.assign({}, params), onSubmit: (data) => {
                  console.log(data);
                  setParams(data);
                  formModalApi.close();
                }
              },
              children: <FormInfo column={1} list={[<Input name="appKey" label="appKey" rule="REQ" />,
                <Input name="token" label="token" rule="REQ" />]} />
            });
          }}>点击设置token</Button>
        </InfoPage.Part>
      </InfoPage.Part>
      {params && <>
        <InfoPage.Part title="普通示例">
          <AliSpeech taskId={AliSpeech.getUUID()} onComplete={(message) => {
            console.log(message);
          }} />
        </InfoPage.Part>
        <InfoPage.Part title="children render用法">
          <AliSpeechRender taskId={AliSpeech.getUUID()} onComplete={(message) => {
            console.log('>>>>>>>>>>>>>>>', message);
          }}>{({ recording, result, onClick }) => {
            return <Space direction="vertical">
              {result && <Alert message={result} />}
              <Button onClick={onClick}>{recording ? '录音中' : '点击开始'}</Button>
            </Space>;
          }}</AliSpeechRender>
        </InfoPage.Part>
      </>}
    </InfoPage>
  </PureGlobal>;
});

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

