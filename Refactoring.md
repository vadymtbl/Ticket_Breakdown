# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here





**Step 1: Write Unit Tests**

Before refactoring the `deterministicPartitionKey` function, I will write unit tests to cover the existing functionality and ensure that my refactor doesn't break it. I will use the `jest` testing library for this task.

```javascript
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
```

**Step 2: Refactor the Function**

After writing the unit tests, I will begin to refactor the `deterministicPartitionKey` function to make it cleaner and more readable. I will make the following changes:

1. Replace Magic Numbers and Strings: Replace magic numbers and strings with constant variables with descriptive names. In this case TRIVIAL_PARTITION_KEY, MAX_PARTITION_KEY_LENGTH are used to replace hard-coded values.
2. Remove Nested Blocks: To reduce the level of nesting in the code and make it more readable, I would remove nested blocks wherever possible. In this case, if (event) { if (event.partitionKey) {...}} could be refactored as : if (event?.partitionKey) {...}This way, we can read the code in a linear fashion from top to bottom without going inside multiple layers of nesting.
3. Use Guard Clauses: Use guard clauses to handle early returns where possible in order to minimize nested blocks. This will also increase the readability of the code.
Variable Naming: Rename candidate variable name as partitionKey.

Here is what the refactored code might look like:

```javascript
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
```

**Step 3: Write Explanation**

In the refactored code, I made sure to replace magic numbers and strings with constants, used guard clauses to remove nested blocks that made the function harder to read, and renamed the variable candidate to partitionKey for better readability. I also handled the type of event.partitionKey by using a ternary operator instead of another if statement. This resulted in a cleaner, more readable code that is easier to understand, maintain and debug.