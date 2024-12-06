const appId = 'vpaas-magic-cookie-df43003702324bf999621717e5c458e2';
const roomId = 'SimpleConsultation';
const userName = 'Professional';

const domain = '8x8.vc';
const options = {
    roomName: `${appId}/${roomId}`,
    width: "100%",
    height: "100vh",
    parentNode: document.getElementById("jaas-container"),
    userInfo: {
        displayName: userName,
        moderator: true,
    },
    interfaceConfigOverwrite: {
        filmStripOnly: false,
        SHOW_JITSI_WATERMARK: false,
        TOOLBAR_BUTTONS: ["camera", "microphone", "desktop", "hangup"],
        SETTINGS_SECTIONS: ["devices"],
    },
    configOverwrite: {
        disableSimulcast: false,
        defaultLanguage: "ptBR",
        enableLobbyChat: false,
        prejoinPageEnabled: false,
    },
};

// Função para atualizar a lista de cameras
async function lisApiCamera(api) {
    const d = await api.getCurrentDevices()
    console.log(d);
}

function displayCameras(cameraList, socket) {
    const thumbnails = document.getElementById('thumbnails');
    thumbnails.innerHTML = '';

    cameraList.forEach((device, index) => {
        const formControl = document.createElement("div")
        formControl.className = "form-control";

        const input = document.createElement("input");
        input.type = "radio";
        input.id = device.id;
        input.name = "input-camera";
        input.value = device.id;
        input.alt = device.name;

        const label = document.createElement("label");
        label.htmlFor = device.id;
        label.textContent = device.label || `Camera ${index + 1}`;

        input.addEventListener("change", () => {
            const selectedCamera = {
                id: input.value,
                name: input.alt
            }
            if (input.checked) {
                socket.emit('cameraSelected', selectedCamera); // Envia o ID da camera para o servidor
                console.log(`Enviando ID da Camera para o servidor: ${input.value}`);

            } else {
                alert('Por favor, selecione uma camera.');
            }
        });

        formControl.appendChild(input);
        formControl.appendChild(label);
        thumbnails.appendChild(formControl);
    });
}

// Inicialize após o carregamento completo do DOM
window.onload = async () => {
    const socket = io('http://localhost:3000');

    // Conectar o Profissional ao servidor
    socket.emit('joinProfessional');

    // Inicializa a API do Jitsi
    new JitsiMeetExternalAPI(domain, options);

    // Carrega as cameras disponíveis
    socket.on('receiveCameras', (cameraList) => {
        console.log('Lista de cameras recebida:', cameraList);
        displayCameras(cameraList, socket);
    });


    //await listCameras(api);

};