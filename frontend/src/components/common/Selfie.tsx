// Reactの関数や型をインポート
import { useState, useRef } from "react";

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";

const selfieCss = css`
  //! No display Camera section in default
  .videosContainer.displayNone {
    display: none;
  }

  //! STOP BUTTON
  .videosContainer.stopBtn {
    display: block;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    position: relative;
    width: fit-content;
    margin: 0 auto 2rem auto;
    padding: 1rem 4rem;
    font-weight: bold;
    font-size: 1.2rem;
    border-radius: 4px;
    color: #4c4c4c;
    border: 3px solid #4c4c4c;
    box-shadow: 5px 5px #4c4c4c;
    transition: 0.3s ease-in-out;

    &:hover {
      box-shadow: none;
      transform: translate(5px, 5px);
      color: #4c4c4c;
    }
  }

  //! OPEN BUTTON
  .openBtn {
    display: block;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    position: relative;
    width: fit-content;
    margin: 0 auto 2rem auto;
    padding: 1rem 4rem;
    font-weight: bold;
    font-size: 1.2rem;
    border-radius: 4px;
    color: #4c4c4c;
    border: 3px solid #4c4c4c;
    box-shadow: 5px 5px #4c4c4c;
    transition: 0.3s ease-in-out;

    &:hover {
      box-shadow: none;
      transform: translate(5px, 5px);
      color: #4c4c4c;
    }
  }

  .openBtn.displayNone {
    display: none;
  }

  .videosContainer {
    display: flex;
    justify-content: center;
    gap: 2rem;
    align-items: center;

    // 1px〜479px
    ${min[0] + max[0]} {
      flex-direction: column;
      align-items: flex-start;
    }

    // 480px〜767px
    ${min[1] + max[1]} {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .videoItem {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 45%;

    video {
      width: 400px;
      height: 300px;

      // 1px〜479px
      ${min[0] + max[0]} {
      }
      // 480px〜767px
      ${min[1] + max[1]} {
      }
      // 768px〜989px
      ${min[2] + max[2]} {
        width: 340px;
        height: 240px;
      }
    }

    canvas {
      width: 400px;
      height: 300px;

      // 1px〜479px
      ${min[0] + max[0]} {
      }
      // 480px〜767px
      ${min[1] + max[1]} {
      }
      // 768px〜989px
      ${min[2] + max[2]} {
        width: 340px;
        height: 240px;
      }
    }
  }

  // 1px〜479px
  ${min[0] + max[0]} {
  }
  // 480px〜767px
  ${min[1] + max[1]} {
  }
  // 768px〜989px
  ${min[2] + max[2]} {
  }
  // 990px〜
  ${min[3] + max[3]} {
  }
`;

// selfieImage の型を定義するためのインターフェース
interface SelfieProps {
  selfieImage: (image64: string | null) => void;
}

//! ===================================================
//! MAIN
//! ===================================================
const Selfie: React.FC<SelfieProps> = ({ selfieImage }) => {
  // 画像のBase64形式の文字列を保存するためのstate
  const [image64, setImage64] = useState<string | null>(null);

  // video要素とcanvas要素への参照を保持するためのref
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Selfie section display
  const [isDisplay, setIsDisplay] = useState<boolean>(false);

  //? ===================================================
  //? START CAMERA
  //? ===================================================
  const startSelfie = () => {
    setIsDisplay(true);

    // playerRefとcanvasRefからDOM要素を取得
    const player = playerRef.current;
    const canvas = canvasRef.current;

    // playerまたはcanvasがnullならば関数を終了
    if (!canvas || !player) {
      return;
    }

    // canvasから2Dコンテキストを取得
    const context = canvas.getContext("2d");
    if (!context) {
      // コンテキストの取得に失敗した場合のエラーログ
      console.error("Error accessing canvas context");
      return;
    }

    // ユーザーのカメラにアクセスしてvideo要素にストリームをセット
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        player.srcObject = stream;
      })
      .catch((error) => {
        // カメラへのアクセスに失敗した場合のエラーログ
        console.error("Error accessing user media:", error);
      });

    // 画像をキャプチャする関数
    const handleCapture = () => {
      context.drawImage(player, 0, 0, canvas.width, canvas.height);
      setImage64(canvas.toDataURL()); // canvasからBase64形式の画像データを取得
    };

    // "capture"ボタンにクリックイベントリスナを追加
    const captureButton = document.getElementById("capture");
    if (captureButton) {
      captureButton.addEventListener("click", handleCapture);
      return () => {
        // コンポーネントがアンマウントされた際にイベントリスナを削除
        captureButton.removeEventListener("click", handleCapture);
      };
    }

    // CLEANUP FUNCTION
    return () => {
      // playerにセットしたストリームを停止
      const stream = player.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    };
  };
  //? ===================================================
  //? カメラを停止する関数 (STOP CAMERA)
  //? ===================================================
  const stopCamera = () => {
    // video要素の参照を取得
    const player = playerRef.current;
    if (!player) return;

    // video要素のsrcObjectをMediaStreamとして取得
    const stream = player.srcObject as MediaStream;
    if (!stream) return;

    // すべてのトラック（ここではビデオトラック）を取得して停止
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());

    // 一応、video要素のsrcObjectもnullにしておく
    player.srcObject = null;

    // video要素を一時停止
    player.pause();
  };

  //! ===================================================
  //! JSX
  //! ===================================================
  return (
    <div css={selfieCss} className="container">
      <div
        onClick={() => startSelfie()}
        className={isDisplay ? "openBtn displayNone" : "openBtn"}
      >
        Open Camera
      </div>

      {/*//! CLOSE BUTTON */}
      <div
        onClick={() => {
          setIsDisplay(false);
          stopCamera();
        }}
        className={
          isDisplay ? "videosContainer stopBtn" : "videosContainer displayNone"
        }
      >
        CLOSE CAMERA
      </div>

      <div
        className={
          isDisplay ? "videosContainer" : "videosContainer displayNone"
        }
      >
        <div className="videoItem">
          {/* カメラの映像を表示するvideo要素 */}
          <video ref={playerRef} id="player" autoPlay></video>

          {/* 画像をキャプチャするボタン */}
          <div id="capture" className="btn btn-primary">
            Capture
          </div>
        </div>

        <div className="videoItem">
          {/* キャプチャされた画像を表示するcanvas要素 */}
          <canvas ref={canvasRef} id="canvas" className="img-size"></canvas>

          {/* キャプチャされた画像を送信するボタン */}
          <div onClick={() => selfieImage(image64)} className="btn btn-success">
            Use
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selfie;
