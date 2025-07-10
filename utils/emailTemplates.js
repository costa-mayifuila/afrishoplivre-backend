// 📁 utils/emailTemplates.js

const emailTemplates = {
  approved: (name, amount) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px;">
            <h2 style="color: #4CAF50;">✅ Seu Saque Foi Aprovado!</h2>
            <p>Olá, <strong>${name}</strong>,</p>
            <p>Seu pedido de saque no valor de <strong>${amount} AOA</strong> foi <strong>aprovado</strong>.</p>
            <p>O valor será enviado para sua conta em breve.</p>
            <hr>
            <p>Obrigado por usar o <strong>AfriShopLivre</strong>!</p>
        </div>
    </div>
  `,

  rejected: (name, amount) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px;">
            <h2 style="color: #E53935;">❌ Seu Saque Foi Rejeitado</h2>
            <p>Olá, <strong>${name}</strong>,</p>
            <p>Infelizmente, seu pedido de saque no valor de <strong>${amount} AOA</strong> foi <strong>rejeitado</strong>.</p>
            <p>Entre em contato com nosso suporte para mais informações.</p>
            <hr>
            <p>Obrigado por usar o <strong>AfriShopLivre</strong>!</p>
        </div>
    </div>
  `
};

export default emailTemplates;
