// ========== 2.12: isEqual ==========
function isEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object')
        return false;

    const aIsArr = Array.isArray(a), bIsArr = Array.isArray(b);
    if (aIsArr !== bIsArr) return false;

    if (aIsArr) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++)
            if (!isEqual(a[i], b[i])) return false;
        return true;
    }

    const keysA = Object.keys(a), keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
        if (!Object.hasOwnProperty.call(b, key)) return false;
        if (!isEqual(a[key], b[key])) return false;
    }
    return true;
}

// ========== 3.1: merge ==========
function merge(...objects) {
    const result = {};
    for (const obj of objects) {
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key) && !(key in result)) {
                result[key] = obj[key];
            }
        }
    }
    return result;
}

// ========== 3.2: inverse ==========
function inverse(arr, skip = 0) {
    const result = [...arr];
    if (skip >= 0) {
        const tail = result.slice(skip);
        tail.reverse();
        result.splice(skip, tail.length, ...tail);
    } else {
        const head = result.slice(0, result.length + skip);
        head.reverse();
        result.splice(0, head.length, ...head);
    }
    return result;
}

// ========== 3.3: flatten ==========
function flatten(arr) {
    const res = [];
    (function flat(sub) {
        for (const item of sub) {
            if (Array.isArray(item)) flat(item);
            else res.push(item);
        }
    })(arr);
    return res;
}

// ========== 3.4: sort ==========
function sortWordsInSentence(sentence) {
    return sentence
        .split(' ')
        .map(word => {
            const sorted = word
                .toLowerCase()
                .split('')
                .sort()
                .join('');
            return sorted.charAt(0).toUpperCase() + sorted.slice(1);
        })
        .sort()
        .join(' ');
}

// ========== 3.5: anagram ==========
function groupAnagrams(words) {
    const map = new Map();
    for (const word of words) {
        const key = word.toLowerCase().split('').sort().join('');
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(word);
    }
    return [...map.values()]
        .filter(group => group.length >= 2)
        .map(group => group.sort());
}

// ========== 3.6: rle ==========
function rle(str) {
    if (!str) return '';
    const result = [];
    let count = 1;
    for (let i = 1; i <= str.length; i++) {
        if (str[i] === str[i - 1]) {
            count++;
        } else {
            result.push(count > 1 ? count + str[i - 1] : str[i - 1]);
            count = 1;
        }
    }
    return result.join('');
}

// Примеры использования 
console.log(isEqual([1,2,[3]], [1,2,[3]]));  // true
console.log(merge({a:1}, {b:2,a:3}));       // {a:1,b:2}
console.log(inverse([1,2,3,4,5], 2));       // [1,2,5,4,3]
console.log(flatten([1,[2,[3,4]]]));        // [1,2,3,4]
console.log(sortWordsInSentence('hello world')); // Ehllo Dlorw?
console.log(groupAnagrams(['cat','dog','tac','god','act']));
console.log(rle('AAABBBBCC'));              // 3A4B2C