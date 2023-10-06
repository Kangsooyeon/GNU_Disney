document.addEventListener("DOMContentLoaded", () => {
    const videoContainer = document.getElementById("video-container");
    const webcam = document.getElementById("webcam");
    const captureButton = document.getElementById("capture-button");
    const canvas = document.getElementById("canvas");
    const capturedImage = document.getElementById("captured-image");
    // const qrCodeElement = document.getElementById("qr-code");

    let stream;

    // 웹캠 스트림 가져오기
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((videoStream) => {
            stream = videoStream;
            webcam.srcObject = videoStream;


        })
        .catch((error) => {
            console.error("웹캠을 가져오는 중 오류 발생: " + error);
        });

    // "찍기" 버튼 클릭 시 사진 찍기
    captureButton.addEventListener("click", () => {
        takePicture();
    });


    function takePicture() {
        const context = canvas.getContext("2d");
        canvas.width = webcam.videoWidth;
        canvas.height = webcam.videoHeight;
        context.drawImage(webcam, 0, 0, canvas.width, canvas.height);

        // 이미지 다운로드 링크 설정
        // Canvas에서 Blob 객체 생성
        canvas.toBlob((blob) => {
            // Blob 객체를 파일로 저장
            const fileName = "captured-image.jpeg";
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style.display = "none";
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        }, "image/jpeg");


            // Canvas에서 이미지 데이터 URL 가져오기
            const imageDataURL = canvas.toDataURL("image/jpeg");

            // 이미지를 <img> 요소에 표시
            capturedImage.src = imageDataURL;
            capturedImage.style.display = "block";

    }



    // 창을 닫을 때 웹캠 스트림 해제
    window.addEventListener("beforeunload", () => {
        if (stream) {
            stream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    });
});