import { useEffect, useState, useMemo } from 'react';
import { Button } from 'antd';

export const useAudioPlayer = ({ src }) => {
  const [playing, setPlaying] = useState(false);
  const audio = useMemo(() => {
    if (!src) {
      return;
    }
    return new Audio(src instanceof Blob ? URL.createObjectURL(src) : src);
  }, [src]);

  useEffect(() => {
    audio.addEventListener('ended', () => {
      setPlaying(false);
    });
    return () => {
      if (src instanceof Blob) {
        URL.revokeObjectURL(audio.src);
      }
    };
  }, [audio, src]);

  return {
    playing, play: async () => {
      audio.currentTime = 0;
      await audio.play();
      setPlaying(true);
    }, pause: () => {
      audio.pause();
      setPlaying(false);
    }, getDuration: async () => {
      if (!audio.duration) {
        return new Promise((resolve, reject) => {
          audio.addEventListener('loadedmetadata', () => {
            resolve();
          });
          audio.addEventListener('error', (e) => {
            reject(e);
          });
        });
      }
      return audio.duration * 1000;
    }
  };
};

export const withAudioPlayer = (WrappedComponent) => {
  return ({ src, ...props }) => {
    const { playing, play, pause } = useAudioPlayer({ src });
    return <>
      <WrappedComponent {...props} playing={playing} onClick={() => {
        if (playing) {
          pause();
        } else {
          play();
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
