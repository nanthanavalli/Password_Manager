const crypto = require("crypto");
require("dotenv").config();

const staticKey = Buffer.from(process.env.AES_KEY, "hex");

const encrypt = (req, res, next) => {
  const password = req.body.password;
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-gcm", staticKey, iv);
  let encryptedPassword = cipher.update(password, "utf-8", "hex");
  encryptedPassword += cipher.final("hex");
  const tag = cipher.getAuthTag();

  req.body.iv = iv.toString("hex");
  req.body.data = encryptedPassword;
  req.body.tag = tag.toString("hex");

  next();
};

const decrypt = (iv, data, tag) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    staticKey,
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(tag, "hex"));

  let decryptedData = decipher.update(data, "hex", "utf-8");
  decryptedData += decipher.final("utf-8");

  return decryptedData;
};

module.exports = { encrypt, decrypt };
