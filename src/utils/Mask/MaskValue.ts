import { UnmaskValue } from "./UnmaskValue";

export type MaskValueProps = {
    mask: string
    charCodes?: {
        [key: string]: {
            regex: RegExp;
            repeat?: boolean;
            transform?: (char: string) => string;
            transformRevert?: (char: string) => string;
        };
    },
    maskReverse?: boolean;
    valuePlaceholder?: string;
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
    '#': { regex: /[0-9]/ },
    'a': { regex: /[a-zA-Z]/, transform: (char: string) => char.toLowerCase() },
    'A': { regex: /[a-zA-Z]/, transform: (char: string) => char.toUpperCase() },
    'z': { regex: /[a-zA-Z]/ }
}

export const MaskValue = (value: string, {
    mask,
    charCodes,
    maskReverse,
    valuePlaceholder
}: MaskValueProps) => {
    const regExps: (Pattern | string)[] = [];

    // Patterns
    if (charCodes) patterns = {
        ...patterns,
        ...charCodes
    }

    const keys = Object.keys(patterns);
    const maskArray = mask.split('');

    maskArray.forEach(char => {
        if (keys.includes(char)) {
            const key = keys.find(key => key === char) as string;
            regExps.push({ [`${key}`]: patterns[key] });

        } else regExps.push(char)
    })

    if (maskReverse) regExps.reverse();

    let newValue: (string | RegExp)[] = [];

    value = UnmaskValue(value, {
        mask, charCodes, maskReverse
    });

    let valueArray = value.split('');

    if (valuePlaceholder) {
        const placeholderArray = UnmaskValue(valuePlaceholder, {
            mask, charCodes, maskReverse
        }).split('');

        if (valueArray.length > placeholderArray.length) {
            let fails = 0;
            const placeholderRamains = () => {
                const placeholder = placeholderArray.join('')

                for (const i in placeholderArray) {
                    const placeholderRamains = placeholder.substring(0, placeholder.length - fails);

                    if (placeholderRamains) {
                        if (value.indexOf(placeholderRamains, 0) === 0) return true;
                        else fails++;
                    }
                    else break;
                }
                return false;
            }

            if (placeholderRamains()) {
                const diff = valueArray.length - placeholderArray.length
                valueArray = valueArray.slice(diff);
            }
        }

        else {
            const diff = placeholderArray.length - valueArray.length;
            valueArray = [...placeholderArray.slice(0, diff), ...valueArray]
        }
    }


    if (maskReverse) valueArray.reverse()

    const constainsRepeat = regExps.filter(regex =>
        (typeof regex === 'object') && regex.repeat
    );

    if (valueArray.length > regExps.length && !constainsRepeat) return valueArray.join('').substring(
        0, valueArray.length - 1
    );

    let previuosRegexs = 0;
    for (let i = 0; i < valueArray.length; i++) {

        if (i > regExps.length - 1) return null;

        let char = valueArray[i]
        if ((i + previuosRegexs) > regExps.length - 1) break;

        if (typeof regExps[i + previuosRegexs] === 'string') {
            let next = 1;
            let strings = [regExps[i + previuosRegexs] as string];

            while (typeof regExps[(i + previuosRegexs) + next] === 'string') {
                strings.push(regExps[(i + previuosRegexs) + next] as string);
                next++;
            }

            for (let index = 0; index < strings.length; index++) if (
                newValue[i + index] !== strings[index]
            ) newValue.push(strings[index]);

            const pattern = regExps[
                ((i + previuosRegexs) + ((next + 1)) <= regExps.length - 1) && strings.length > 1 ?
                    (i + previuosRegexs) + (next + 1) :
                    (i + previuosRegexs) + next
            ] as Pattern;

            const key = Object.keys(pattern)[0];

            const regExp = pattern[`${key}`].regex;
            const repeatPatern = pattern[`${key}`].repeat;
            const transform = pattern[`${key}`].transform;

            if (repeatPatern) {
                for (let w = i; w < valueArray.length; w++) {
                    char = valueArray[w];
                    if (regExp.test(char)) {
                        if (transform !== undefined) char = transform(char);
                        newValue.push(char);
                    }
                }
                break;

            } else if (regExp.test(char)) {
                if (transform !== undefined) char = transform(char);
                newValue.push(char);
                previuosRegexs += strings.length;
            }

        } else {
            const pattern = regExps[i + previuosRegexs] as Pattern;
            const key = Object.keys(pattern)[0];

            const regExp = pattern[`${key}`].regex;
            const repeatPatern = pattern[`${key}`].repeat;
            const transform = pattern[`${key}`].transform;

            if (repeatPatern) {
                for (let w = i; w < valueArray.length; w++) {
                    char = valueArray[w]
                    if (regExp.test(char)) {
                        if (transform !== undefined)
                            char = transform(char);
                        newValue.push(char);
                    }
                }
                break;

            } else if (regExp.test(char)) {
                if (transform !== undefined)
                    char = transform(char);
                newValue.push(char);
            }
        }
    }

    if (maskReverse) newValue.reverse();

    return newValue.join('');
}