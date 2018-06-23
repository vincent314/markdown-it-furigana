module.exports = function (md) {

    const furiganaScanRE = /([\u4e00-\u9faf])（([\u3040-\u3096]+?)）/;

    function buildTag(state, tag, content) {
        return [
            new state.Token(`${tag}-open`, tag, 1),
            Object.assign(new state.Token('text', '', 0), { content }),
            new state.Token(`${tag}-close`, tag, -1)
        ]
    }

    function buildFuriganaTokens(state, kanji, hiragana) {
        return [
            new state.Token('ruby-open', 'ruby', 1),
            ...buildTag(state, 'rb', kanji),
            ...buildTag(state, 'rp', '（'),
            ...buildTag(state, 'rt', hiragana),
            ...buildTag(state, 'rp', '）'),
            new state.Token('ruby-close', 'ruby', -1)
        ]
    }

    function split(text, state, nodes) {
        const indexOf = text.search(furiganaScanRE);

        if (indexOf === 0) {
            const [match, kanji, hiragana] = furiganaScanRE.exec(text);
            nodes.push(...buildFuriganaTokens(state, kanji, hiragana));
            split(text.slice(match.length), state, nodes);
        } else if (indexOf < 0) {
            nodes.push(Object.assign(new state.Token('text', '', 0), { content: text }));
        } else {
            nodes.push(Object.assign(new state.Token('text', '', 0), { content: text.slice(0, indexOf) }));
            split(text.slice(indexOf), state, nodes);
        }
    }

    function searchAndReplace(token, state) {
        if (token.type === 'text' && furiganaScanRE.test(token.content)) {
            const nodes = [];
            split(token.content, state, nodes);
            return nodes;
        } else {
            return [token]
        }
    }

    md.core.ruler.push('furigana', (state) => {

        state.tokens
            .filter(t => t.type === 'inline')
            .forEach(t => {
                const children = [];
                t.children.forEach(child => children.push(...searchAndReplace(child, state)));
                t.children = children;
            });
    });
};