import { createWithRemoteLoader } from '@kne/remote-loader';
import { useState, useMemo } from 'react';
import useSpeech from './useSpeech';
import { useAudioRecord } from '@components/Speech';
import useRefCallback from '@kne/use-ref-callback';

export const AliSpeechRender = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset']
})(({ remoteModules, taskId, onComplete, onUpload, onCancel, audioName, children, ...props }) => {
  const [usePreset] = remoteModules;
  const { ajax, apis } = usePreset();
  const [resultChunks, setResultChunks] = useState({});
  const result = useMemo(() => {
    return Object.keys(resultChunks).sort((a, b) => a - b).map((index) => resultChunks[index]).join('');
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

  const { recording, start: startRecord, stop: stopRecord } = useAudioRecord();

  const handlerStart = useRefCallback(async () => {
    setResultChunks([]);
    const { stream } = await startRecord();
    await start({ stream });
  });

  const handlerCancel = useRefCallback(async () => {
    await stopRecord();
    end();
    onCancel && onCancel();
  });

  const handlerComplete = useRefCallback(async () => {
    const chunks = await stopRecord();
    const { taskId, messageId } = end();
    const file = new File([new Blob(chunks, { type: 'audio/wav' })], `${audioName || `${taskId}-${messageId}`}.wav`, { type: 'audio/wav' });
    const { data: resData } = await (typeof onUpload === 'function' ? onUpload : apis.ossUpload)({ file });
    if (resData.code !== 0) {
      return;
    }
    onComplete && onComplete({ taskId, messageId, result, audio: resData.data });
  });

  const handlerChange = useRefCallback((...args) => recording ? handlerComplete(...args) : handlerStart(...args));

  return children({
    ...props,
    recording,
    result,
    start: handlerStart,
    cancel: handlerCancel,
    complete: handlerComplete,
    change: handlerChange
  });
});

const withAliSpeech = (WrappedComponent) => (props) => {
  return <AliSpeechRender {...props}>{({ result, start, complete, cancel, ...props }) => <WrappedComponent {...props}
                                                                                                           result={result}
                                                                                                           cancel={cancel}
                                                                                                           onStart={start}
                                                                                                           onComplete={complete} />}</AliSpeechRender>;
};

export default withAliSpeech;
