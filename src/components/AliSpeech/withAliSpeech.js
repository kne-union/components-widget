import { createWithRemoteLoader } from '@kne/remote-loader';
import { useState } from 'react';
import useSpeech from './useSpeech';

const withAliSpeech = (WrappedComponent) => createWithRemoteLoader({
  modules: ['components-core:Global@usePreset']
})(({ remoteModules, appKey, taskId, onComplete, onUpload, audioName, ...props }) => {
  const [usePreset] = remoteModules;
  const { ajax, ajaxForm, apis } = usePreset();
  const [result, setResult] = useState('');
  const { start, end } = useSpeech({
    appKey, taskId, onChange: (data) => {
      setResult((result) => result + data.result);
    }, getToken: async () => {
      const { data } = await ajax(Object.assign({}, apis.aliSpeech.getToken));
      if (data.code !== 0) {
        return;
      }
      return data.data.token;
    }
  });

  return <WrappedComponent {...props} result={result} onStart={async (...args) => {
    setResult('');
    await start(...args);
  }} onComplete={async (chunks) => {
    const { taskId, messageId } = end();
    const file = new File([new Blob(chunks, { type: 'audio/wav' })], `${audioName || `${taskId}-${messageId}`}.wav`, { type: 'audio/wav' });
    const { data: resData } = await (typeof onUpload === 'function' ? onUpload : apis.ossUpload)({file});
    if (resData.code !== 0) {
      return;
    }
    onComplete && onComplete({ taskId, messageId, result, audio: resData.data });
  }} />;
});

export default withAliSpeech;
