const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  
  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }
  
  const data = event.partitionKey || JSON.stringify(event);
  const partitionKey = typeof data === 'string' ? data : JSON.stringify(data);

  if (partitionKey.length > MAX_PARTITION_KEY_LENGTH) {
    return crypto.createHash("sha3-512").update(partitionKey).digest("hex");
  }

  return partitionKey;
};