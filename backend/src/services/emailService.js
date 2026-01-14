import "dotenv/config";
import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sender = {
  name: process.env.BREVO_SENDER_NAME,
  email: process.env.BREVO_SENDER_EMAIL,
};

// ✉️ Falta información
export const sendCorrectionEmail = async (to, observation) => {
  await apiInstance.sendTransacEmail({
    sender,
    to: [{ email: to }],
    subject: "Corrección requerida en su solicitud",
    htmlContent: `
      <p>Estimado/a estudiante,</p>

      <p>Su solicitud presenta observaciones que deben ser corregidas:</p>

      <blockquote style="background:#f8f9fa;padding:10px;border-left:4px solid #c62828">
        ${observation}
      </blockquote>

      <p>Por favor ingrese nuevamente al sistema y realice las correcciones solicitadas.</p>

      <p style="margin-top:20px;font-size:12px;color:#666">
        Este correo fue enviado automáticamente por el sistema institucional.
      </p>
    `,
  });
};

// ✉️ Aprobada
export const sendApprovedEmail = async (to) => {
  await apiInstance.sendTransacEmail({
    sender,
    to: [{ email: to }],
    subject: "Solicitud aprobada",
    htmlContent: `
      <p>Estimado/a estudiante,</p>

      <p>
        Nos complace informarle que su solicitud ha sido
        <strong style="color:#2e7d32">APROBADA</strong>.
      </p>

      <p>No es necesario realizar ninguna acción adicional.</p>

      <p style="margin-top:20px;font-size:12px;color:#666">
        Este correo fue enviado automáticamente por el sistema institucional.
      </p>
    `,
  });
};

// ✉️ Rechazada (opcional)
export const sendRejectedEmail = async (to) => {
  await apiInstance.sendTransacEmail({
    sender,
    to: [{ email: to }],
    subject: "Solicitud rechazada",
    htmlContent: `
      <p>Estimado/a estudiante,</p>

      <p>
        Su solicitud ha sido <strong style="color:#c62828">RECHAZADA</strong>.
      </p>

      <p>
        Para más información, puede comunicarse con la asociación.
      </p>

      <p style="margin-top:20px;font-size:12px;color:#666">
        Este correo fue enviado automáticamente por el sistema institucional.
      </p>
    `,
  });
};
