import { createWithRemoteLoader } from '@kne/remote-loader';
import { useState, useMemo } from 'react';
import useSpeech from './useSpeech';

const withAliSpeech = (WrappedComponent) => createWithRemoteLoader({
  modules: ['components-core:Global@usePreset']
})(({ remoteModules, taskId, onComplete, onUpload, audioName, ...props }) => {
  const [usePreset] = remoteModules;
  const { ajax, apis } = usePreset();
  const [resultChunks, setResultChunks] = useState({});
  const result = useMemo(() => {
    return Object.keys(resultChunks).sort().map((index) => resultChunks[index]).join('');
  }, [resultChunks]);
  const { start, end } = useSpeech({
    taskId, onChange: (data) => {
      setResultChunks((chunks) => {
        return Object.assign({}, chunks, { [data.index]: data.result });
      });
    }, getToken: async () => {
      const { data } = await ajax(Object.assign({}, apis.aliSpeech.getToken));
      if (data.code !== 0) {
        return;
      }
      return data.data;
    }
  });

  return <WrappedComponent {...props} result={result} onStart={async (...args) => {
    setResultChunks([]);
    await start(...args);
  }} onComplete={async (chunks) => {
    const { taskId, messageId } = end();
    const file = new File([new Blob(chunks, { type: 'audio/wav' })], `${audioName || `${taskId}-${messageId}`}.wav`, { type: 'audio/wav' });
    const { data: resData } = await (typeof onUpload === 'function' ? onUpload : apis.ossUpload)({ file });
    if (resData.code !== 0) {
      return;
    }
    onComplete && onComplete({ taskId, messageId, result, audio: resData.data });
  }} />;
});

export default withAliSpeech;
