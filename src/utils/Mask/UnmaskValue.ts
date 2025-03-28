export type UnmaskValueProps = {
    mask: string, 
    charCodes?: {
        [key: string]: {
            regex: RegExp;
            repeat?: boolean;
            transform?: (char: string) => string;
            transformRevert?: (char: string) => string;
        }; 
    },
    maskReverse?: boolean;
}

type Pattern = {
    [key: string]: {
        regex: RegExp,
        repeat?: boolean;
        transform?: (char: string) => string;
        transformRevert?: (char: string) => string;
    }
}

let patterns: Pattern = {
    '9': { regex: /[0-9]/ },
    'a': { regex: /[a-zA-Z]/, transform: (char: string) => char.toLowerCase() },
    'A': { regex: /[a-zA-Z]/, transform: (char: string) => char.toUpperCase() },
    'z': { regex: /[a-zA-Z]/ }
}

export const UnmaskValue = (value: string, { mask, charCodes, maskReverse }: UnmaskValueProps): string => {
    const regExps: (Pattern | string)[] = [];
    
    // Patterns
    if(charCodes) patterns = {
        ...patterns,
        ...charCodes
    }

    const keys = Object.keys(patterns);
    const maskArray = mask.split('');

    maskArray.forEach(char => {
        if(keys.includes(char)) {
            const key = keys.find(key => key === char) as string;
            regExps.push({[`${key}`]: patterns[key]});

        } else regExps.push(char)
    })
    
    if(maskReverse) regExps.reverse();


    let unmaskedValue: (string | RegExp)[] = [];

    const valueArray = value.split('');

    for(let i = 0; i < valueArray.length; i++) {
        if(i > regExps.length - 1) break;

        let char = valueArray[i]

        if(typeof regExps[i] === 'string' && char !== regExps[i]) {
            let next = 1;
            while(typeof regExps[i + next] === 'string') next++;


            const pattern = regExps[i + next] as Pattern;
            const key = Object.keys(pattern)[0];

            const regExp = pattern[`${key}`].regex;
            const repeat = pattern[`${key}`].repeat;
            const transformRevert = pattern[`${key}`].transformRevert;

            if(repeat) {
                for(let w = i; w < valueArray.length; w++) {
                    char = valueArray[w]
                    if(regExp.test(char)) {
                        if(transformRevert !== undefined) char = transformRevert(char);
                        unmaskedValue.push(char);
                    }
                }
                break;

            } else if(regExp.test(char)) {
                if(transformRevert !== undefined) char = transformRevert(char);
                unmaskedValue.push(char);
            }

        } else if(typeof regExps[i] !== 'string') {
            let char = valueArray[i]

            const pattern = regExps[i] as Pattern;
            const key = Object.keys(pattern)[0];

            const regExp = pattern[`${key}`].regex;
            const repeat = pattern[`${key}`].repeat;
            const transformRevert = pattern[`${key}`].transformRevert;

            if(repeat) {
                for(let w = i; w < valueArray.length; w++) {
                    char = valueArray[w]
                    if(regExp.test(char)) {
                        if(transformRevert !== undefined) char = transformRevert(char);
                        unmaskedValue.push(char);
                    }
                }
                break;

            } else if(regExp.test(char)) {
                if(transformRevert !== undefined) char = transformRevert(char);
                unmaskedValue.push(char);
            }
        }
    }

    return unmaskedValue.join('');
}