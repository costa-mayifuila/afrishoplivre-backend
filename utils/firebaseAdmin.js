//import admin from "firebase-admin";
//import fs from "fs";

// 📁 Corrigindo importação do JSON
//const serviceAccount = JSON.parse(
//  fs.readFileSync(new URL("../firebase-adminsdk.json", import.meta.url))
//);

// Inicializa o Firebase apenas se ainda não estiver inicializado
//if (!admin.apps.length) {
  //admin.initializeApp({
    //credential: admin.credential.cert(serviceAccount),
  //});
//}

//const messaging = admin.messaging();

//const sendPushNotification = async (token, title, body) => {
  //try {
    //const message = {
      //token,
      //notification: { title, body },
    //};

    //await messaging.send(message);
    //console.log("🔔 Notificação enviada com sucesso!");
  //} catch (error) {
    //console.error("Erro ao enviar notificação:", error);
 // }
//};

//export default sendPushNotification;
