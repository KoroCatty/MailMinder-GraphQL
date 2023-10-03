// Reactの関数や型をインポート
import { useState, useRef } from "react";

// handleImageChange3の型を定義するためのインターフェース
interface SelfieProps {
  handleImageChange3: (image64: string | null) => void;
}

// SelfieというReactの関数コンポーネント
const Selfie: React.FC<SelfieProps> = ({ handleImageChange3 }) => {
  // 画像のBase64形式の文字列を保存するためのstate
  const [image64, setImage64] = useState<string | null>(null);

  // video要素とcanvas要素への参照を保持するためのref
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // コンポーネントがマウントされた時に実行されるeffect
  // useEffect(() => {
    const startSelfie = () => {
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
  }

  // JSXを返す
  return (
    <div className="container">
      <div onClick={()=> startSelfie()} style={{fontSize: "3rem", cursor: "pointer", border: "1px red dashed"}}>Start Selfie</div>
      <div>
        {/* カメラの映像を表示するvideo要素 */}
        <video ref={playerRef} id="player" autoPlay style={{width:"100%"}} ></video>
      </div>

      {/* 画像をキャプチャするボタン */}
      <div id="capture" className="btn btn-primary w-100 my-1">
        Capture
      </div>

      {/* キャプチャされた画像を表示するcanvas要素 */}
      <canvas
        ref={canvasRef}
        id="canvas"
        className="img-size"
        width={320}
        height={240}
      ></canvas>
      
      {/* キャプチャされた画像を送信するボタン */}
      <div onClick={() => handleImageChange3(image64)} className="btn btn-success w-100 my-2">
        Submit
      </div>

    </div>
  );
}

// Selfieコンポーネントをエクスポート
export default Selfie;
