const { deterministicPartitionKey } = require('./dpk.js');

describe('deterministicPartitionKey', () => {
  test('returns trivial partition key if no event is passed', () => {
    expect(deterministicPartitionKey()).toBe('0');
  });

  test('uses existing partition key if it exists in event', () => {
    expect(deterministicPartitionKey({ partitionKey: 'test' })).toBe('test');
  });

  test('hashes JSON string of event if no partition key exists', () => {
    const event = { id: 1, name: 'Vadym Martynenko' };
    expect(deterministicPartitionKey(event)).not.toBe('');
  });

  test('converts non-string candidate to JSON string before hashing', () => {
    const event = { id: 1, name: 'Vadym Martynenko' };
    expect(deterministicPartitionKey({ partitionKey: event })).toBe(JSON.stringify(event));
  });

  test('hashes candidate if its length exceeds MAX_PARTITION_KEY_LENGTH', () => {
    const longStr = 'a'.repeat(300);
    expect(deterministicPartitionKey({ partitionKey: longStr })).not.toBe(longStr);
  });
});
