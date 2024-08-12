import { AudioRecordButton } from '@components/Speech';
import withAliSpeech, { AliSpeechRender } from './withAliSpeech';
import getUUID from './getUUID';
import useSpeech from './useSpeech';

const AliSpeech = withAliSpeech(({ result, onStart, onComplete, ...props }) => {
  return <>
    <AudioRecordButton {...props} onStart={onStart} onComplete={onComplete} />
    {result && <div>{result}</div>}
  </>;
});

AliSpeech.getUUID = getUUID;
AliSpeech.useSpeech = useSpeech;
AliSpeech.AliSpeechRender = AliSpeechRender;

export default AliSpeech;

export { getUUID, useSpeech, AliSpeechRender };

export { default as getApis } from './getApis';
