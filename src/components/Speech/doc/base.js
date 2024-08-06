const { default: Speech, AudioRecordButton, AudioPlayerButton } = _Speech;
const { useState } = React;
const BaseExample = () => {
  const [record, setRecord] = useState(null);
  return <>
    <AudioRecordButton onStart={() => {
      setRecord(null);
    }} onComplete={(chunks) => {
      setRecord(new Blob(chunks, { type: chunks[0].type }));
    }} />
    {record && <AudioPlayerButton src={record} />}
  </>;
};

render(<BaseExample />);
