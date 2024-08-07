const { default: Speech, AudioRecordButton, AudioPlayerButton, useAudioPlayer } = _Speech;
const { useState } = React;
const { Button } = antd;

const DurationButton = ({ src }) => {
  const { getDuration } = useAudioPlayer({ src });
  return <Button onClick={() => {
    getDuration().then((time) => console.log(time));
  }}>获取时长</Button>;
};

const BaseExample = () => {
  const [record, setRecord] = useState(null);
  return <>
    <AudioRecordButton onStart={() => {
      setRecord(null);
    }} onComplete={(chunks) => {
      setRecord(new Blob(chunks, { type: chunks[0].type }));
    }} />
    {record && <>
      <AudioPlayerButton src={record} />
      <DurationButton src={record} />
    </>}
  </>;
};

render(<BaseExample />);
