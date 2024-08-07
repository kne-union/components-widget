import { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';

export const withAudioPlayer = (WrappedComponent) => {
  return ({ src, ...props }) => {
    const ref = useRef(null);
    const [playing, setPlaying] = useState(false);
    useEffect(() => {
      if (!src) {
        return;
      }
      const audio = new Audio(src instanceof Blob ? URL.createObjectURL(src) : src);
      const events = [['loadeddata', () => {
        console.log('数据加载完成');
        ref.current = audio;
      }], ['ended', () => {
        console.log('播放完毕');
        setPlaying(false);
      }]];

      events.forEach(([name, handler]) => audio.addEventListener(name, handler));
      return () => {
        events.forEach(([name, handler]) => audio.removeEventListener(name, handler));
        if (src instanceof Blob) {
          URL.revokeObjectURL(audio.src);
        }
      };
    }, [src]);

    return <>
      <WrappedComponent {...props} playing={playing} onClick={() => {
        if (!ref.current) {
          return;
        }
        if (playing) {
          ref.current.pause();
          setPlaying(false);
        } else {
          ref.current.currentTime = 0;
          ref.current.play();
          setPlaying(true);
        }
      }} />
    </>;
  };
};

export const AudioPlayerRender = withAudioPlayer(({ children, ...props }) => {
  return children(props);
});

const AudioPlayerButton = withAudioPlayer(({ playing, ...props }) => {
  return <Button {...props}>{playing ? '正在播放...' : '点击播放'}</Button>;
});

export default AudioPlayerButton;
