// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
      origin: ['http://localhost:8080', 'http://localhost'], 
      methods: ['GET', 'POST'], 
      allowedHeaders: ['Content-Type'],
      credentials: true,
    }
  });

let beneficiaryCameras = [];

io.on('connection', (socket) => {
    console.log('Novo cliente conectado');

    // Escutando a mensagem do Beneficiario
    socket.on('sendCameras', (cameraList) => {
        socket.join('beneficiary');
        console.log('Beneficiario atualizou a lista de câmeras:', cameraList);
        beneficiaryCameras = cameraList;

        // Enviar a lista de câmeras para o Profissional
        socket.to('professional').emit('receiveCameras', beneficiaryCameras);
    });


    // Escutando a mensagem do Profissional
    socket.on('cameraSelected', (camera) => {
        console.log('Profissional escolheu a Câmera com ID:', camera);

        // Envia para o Beneficiário específico
        socket.to('beneficiary').emit('cameraSelected', camera); 
        
        // Envia para todos, exceto o remetente
        //socket.broadcast.emit('cameraSelected', camera); 
    });

    // Quando o Profissional se conecta
    socket.on('joinProfessional', () => {
        socket.join('professional');
        console.log('Profissional conectado');
    });

    // Quando o cliente se desconecta
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor Node.js com Socket.io rodando na porta 3000');
});
