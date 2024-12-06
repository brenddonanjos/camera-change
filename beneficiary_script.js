const appId = 'vpaas-magic-cookie-df43003702324bf999621717e5c458e2';
const roomId = 'SimpleConsultation';
const userName = 'Beneficiary';

const domain = '8x8.vc';
const options = {
    roomName: `${appId}/${roomId}`,
    width: "100%",
    height: "100vh",
    parentNode: document.getElementById("jaas-container"),
    userInfo: {
        displayName: userName,
        moderator: false,
    },
    interfaceConfigOverwrite: {
        filmStripOnly: false,
        SHOW_JITSI_WATERMARK: false,
        TOOLBAR_BUTTONS: [],
        SETTINGS_SECTIONS: [],
    },
    configOverwrite: {
        disableSimulcast: false,
        defaultLanguage: "ptBR",
        enableLobbyChat: false,
        prejoinPageEnabled: false,
    },
    videoQuality: {
        minHeight: 240,
        maxHeight: 720,
    }
};

async function listCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(device => device.kind === 'videoinput');

    if (videoInputs.length === 0) {
        return [];
    }

    var cameras = [];
    videoInputs.forEach((device, index) => {
        cameras.push({
            id: device.deviceId,
            name: device.label,
            index: index,
        });
    });

    return cameras;
}

function sendCameraList(socket, cameras) {
    socket.emit("sendCameras", cameras);
    console.log('Lista de cameras enviada:', cameraList);
}

window.onload = async () => {
    const cameras = await listCameras();

    const socket = io('http://35.247.230.61:80');

    socket.on("connect", () => {
        socket.emit("sendCameras", cameras)
    });
    //sendCameraList(socket, cameras);
    //setInterval(socket.emit("sendCameras", cameras), 5000);

    socket.on("connect_error", (error) => {
        console.error("Erro na conexão socket.io:", error);
    });

    socket.on("disconnect", () => {
        console.log("Desconectado do servidor.");
    });

    const api = new JitsiMeetExternalAPI(domain, options);

    // Escutando a mensagem 'cameraSelected' enviada pelo Profissional
    socket.on('cameraSelected', (camera) => {
        console.log('Profissional trocou para a Câmera com ID:', camera.id);
        
        api.setVideoInputDevice(camera.name, camera.id);
    });

};