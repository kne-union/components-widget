import { AudioRecordButton, withAudioRecord } from '@components/Speech';
import withAliSpeech from './withAliSpeech';
import getUUID from './getUUID';
import useSpeech from './useSpeech';
import compose from '@kne/compose';

const AliSpeech = withAliSpeech(({ result, onStart, onComplete, ...props }) => {
  return <>
    <AudioRecordButton {...props} onStart={onStart} onComplete={onComplete} />
    {result && <div>{result}</div>}
  </>;
});

export const AliSpeechRender = compose(withAliSpeech, withAudioRecord)(({ children, ...props }) => {
  return children(props);
});

AliSpeech.getUUID = getUUID;
AliSpeech.useSpeech = useSpeech;
AliSpeech.AliSpeechRender = AliSpeechRender;

export default AliSpeech;

export { getUUID, useSpeech };

export { default as getApis } from './getApis';
