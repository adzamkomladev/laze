export default () => ({
  senderId: process.env.PHONE_VERIFICATION_SENDER_ID,
  length: parseInt(process.env.PHONE_VERIFICATION_LENGTH, 10),
  expiry: parseInt(process.env.PHONE_VERIFICATION_EXPIRY, 10),
  type: process.env.PHONE_VERIFICATION_TYPE,
  medium: process.env.PHONE_VERIFICATION_MEDIUM,
});
