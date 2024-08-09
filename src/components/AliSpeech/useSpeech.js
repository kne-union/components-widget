import { useRef } from 'react';
import useRefCallback from '@kne/use-ref-callback';
import getUUId from './getUUID';

const useSpeech = ({ taskId, getToken, onChange }) => {
  const wsRef = useRef(null);
  const start = useRefCallback(async ({ stream }) => {
    const tokenRes = await getToken();
    if (!tokenRes) {
      throw new Error('获取token失败');
    }

    const { token, appKey } = tokenRes;
    const ws = new WebSocket(`wss://nls-gateway-cn-shanghai.aliyuncs.com/ws/v1?token=${token}`);
    const messageId = getUUId();
    await new Promise((resolve) => {
      ws.addEventListener('open', () => {
        console.log('socket链接成功');
        ws.send(JSON.stringify({
          'header': {
            'message_id': messageId,
            'task_id': taskId,
            'namespace': 'SpeechTranscriber',
            'name': 'StartTranscription',
            'appkey': appKey
          }, 'payload': {
            'format': 'pcm',
            'sample_rate': 16000,
            'max_sentence_silence': 200,
            'enable_intermediate_result': true,
            'enable_punctuation_prediction': true,
            'enable_inverse_text_normalization': true
          }
        }));
      });
      ws.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);
        if (data.header.name === 'TranscriptionStarted') {
          resolve();
        }
        if (data.header.name === 'TranscriptionResultChanged') {
          onChange && onChange(data.payload);
        }
        if (data.header.name === 'SentenceEnd') {
          onChange && onChange(data.payload);
        }
      });
    });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 16000
    });
    const audioInput = audioContext.createMediaStreamSource(stream);

    // 设置缓冲区大小为2048的脚本处理器
    const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
    scriptProcessor.onaudioprocess = function(event) {
      const inputData = event.inputBuffer.getChannelData(0);
      const inputData16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; ++i) {
        inputData16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF; // PCM 16-bit
      }
      ws.send(inputData16.buffer);
    };
    audioInput.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);
    console.log('开始识别');
    wsRef.current = { ws, taskId, messageId, scriptProcessor, audioInput, stream, audioContext, appKey };
  }), end = useRefCallback(() => {
    if (!wsRef.current) {
      console.warn('连接尚未建立或者已经断开');
      return;
    }
    const { ws, taskId, messageId, scriptProcessor, audioInput, audioContext, appKey } = wsRef.current;
    ws.send(JSON.stringify({
      'header': {
        'message_id': messageId,
        'task_id': taskId,
        'namespace': 'SpeechTranscriber',
        'name': 'StopTranscription',
        'appkey': appKey
      }
    }));
    ws.close();
    if (scriptProcessor) {
      scriptProcessor.disconnect();
    }
    if (audioInput) {
      audioInput.disconnect();
    }
    if (audioContext) {
      audioContext.close();
    }
    wsRef.current = null;

    return { taskId, messageId };
  });
  return { start, end };
};

export default useSpeech;
