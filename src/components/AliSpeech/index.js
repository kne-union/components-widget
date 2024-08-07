import { AudioRecordButton } from '@components/Speech';
import withAliSpeech from './withAliSpeech';
import getUUID from './getUUID';
import useSpeech from './useSpeech';

const AliSpeech = withAliSpeech(({ result, onStart, onComplete }) => {
  return <>
    <AudioRecordButton onStart={onStart} onComplete={onComplete} />
    {result && <div>{result}</div>}
  </>;
});

AliSpeech.getUUID = getUUID;
AliSpeech.withAliSpeech = withAliSpeech;
AliSpeech.useSpeech = useSpeech;

export default AliSpeech;

export { getUUID, withAliSpeech, useSpeech };

export { default as getApis } from './getApis';
