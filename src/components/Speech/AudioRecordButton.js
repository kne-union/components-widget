import { useState, useRef } from 'react';
import { App } from 'antd';
import useRefCallback from '@kne/use-ref-callback';
import { createWithRemoteLoader } from '@kne/remote-loader';

export const useAudioRecord = ({ onComplete, onData, onStart, onCancel }) => {
  const [recording, setRecording] = useState(false);
  const audioRef = useRef([]);
  const { message } = App.useApp();
  const handlerComplete = useRefCallback(onComplete);
  const handlerData = useRefCallback(onData);
  const handlerStart = useRefCallback(onStart);
  const handlerCancel = useRefCallback(onCancel);
  const start = useRefCallback(async () => {
    const stream = await window.navigator.mediaDevices.getUserMedia({ audio: true }).catch((e) => {
      message.error('出错，请确保已允许浏览器获取录音权限');
      throw e;
    });
    const recorder = new window.MediaRecorder(stream);
    audioRef.current = { stream, recorder };
    const events = [['start', () => {
      audioRef.current.chunks = [];
      handlerStart({ stream, recorder });
    }], ['dataavailable', (e) => {
      handlerData(e.data);
      audioRef.current.chunks.push(e.data);
    }]];
    audioRef.current.events = events;
    events.forEach(([name, handler]) => recorder.addEventListener(name, handler));
    recorder.start(1000);
    setRecording(true);
    return { stream, recorder };
  });

  const stopRecord = (isUnmount) => {
    !isUnmount && setRecording(false);
    if (!audioRef.current) {
      return;
    }
    const {events, recorder, stream, chunks} = audioRef.current;
    events.forEach(([name, handler]) => recorder.removeEventListener(name, handler));
    stream.getTracks().forEach(track => track.stop());
    audioRef.current = null;
    return chunks;
  };

  const stop = useRefCallback(async (isUnmount) => {
    const chunks = stopRecord(isUnmount);
    await handlerComplete(chunks);
  });

  const cancel = useRefCallback(async () => {
    stopRecord();
    await handlerCancel();
  });

  const change = useRefCallback(async () => {
    if (recording) {
      await stop();
    } else {
      await start();
    }
  });

  return {
    recording, start, stop, cancel, change
  };
};

export const withAudioRecord = (WrappedComponent) => {
  return ({onComplete, onData, onStart, onCancel, ...props}) => {
    const {
      recording, start, stop, cancel, change
    } = useAudioRecord({onComplete, onData, onStart, onCancel});

    return <WrappedComponent {...props} recording={recording} start={start} stop={stop} cancel={cancel}
                             onClick={change}/>;
  };
};

export const AudioRecordRender = ({ children, ...props }) => {
  return children(props);
};

const AudioRecordButton = withAudioRecord(createWithRemoteLoader({
  modules: ['components-core:LoadingButton']
})(({ remoteModules, recording, children, start, stop, ...props }) => {
  const [LoadingButton] = remoteModules;
  return <LoadingButton {...props}>{children ? children(recording) : (recording ? '正在录制' : '点击开始')}</LoadingButton>;
}));

export default AudioRecordButton;
