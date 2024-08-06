import { AudioRecordButton } from '@components/Speech';
import withAliSpeech from './withAliSpeech';
import getUUID from './getUUID';

const AliSpeech = withAliSpeech(({ result, onStart, onComplete }) => {
  return <>
    <AudioRecordButton onStart={onStart} onComplete={onComplete} />
    {result && <div>{result}</div>}
  </>;
});

AliSpeech.getUUID = getUUID;

export default AliSpeech;

export { getUUID };

export { default as getApis } from './getApis';
