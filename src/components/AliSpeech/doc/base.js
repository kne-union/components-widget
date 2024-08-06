const { default: AliSpeech } = _AliSpeech;
const BaseExample = () => {
  return <AliSpeech appKey="SmSM259tqeAbzP7J" taskId={AliSpeech.getUUID()} onComplete={(message) => {
    console.log(message);
  }} />;
};

render(<BaseExample />);
