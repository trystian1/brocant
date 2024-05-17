import { currencyConverterEn } from "@/pages";
import { app } from "@/utils/firebase.config";
import { randomUUID } from "crypto";
import { getDatabase, ref, set } from "firebase/database";
import { NextApiRequest, NextApiResponse } from "next";

const { createMollieClient } = require("@mollie/api-client");
const mollieClient = createMollieClient({
  apiKey: "test_s8h6UB6THxWw8qfNDHJq856rG6scJC",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const orderId = randomUUID();
  const { amount, title, products, userId } = JSON.parse(req.body);
  console.log(orderId, products, userId);
  const payment = await mollieClient.payments.create({
    amount: {
      currency: "EUR",
      value: `${amount.toFixed(2)}`,
    },
    // customer: customerReference,
    description: title,
    redirectUrl: `http://localhost:3000/order/${orderId}`,
    metadata: {
      order_id: orderId,
    },
  });
  const database = getDatabase(app);
  const data = { ...payment };

  await set(ref(database, `orders/${userId}/${orderId}`), {
    amount,
    products,
    title,
    payment: { id: data.id, createdAt: data.createdAt },
    status: "NOT_PAID",
  });

  if (payment) {
    return res.status(200).json({
      checkoutUrl: data._links.checkout.href,
      paymentId: data.id,
      orderId: orderId,
    });
  }
}
