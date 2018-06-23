const md = require('markdown-it')()
    .use(require('../src/furigana-plugin'));

describe('Test Markdown-it Furigana plugin', () => {
    it('should test basic markdown rendering', () => {
        const result = md.render('**BOLD** text');
        expect(result).toBe('<p><strong>BOLD</strong> text</p>\n');
    });

    it('should test simple furigana markdown', () => {
        const result = md.render('福（ふく）')
        expect(result).toBe('<p><ruby><rb>福</rb><rp>（</rp><rt>ふく</rt><rp>）</rp></ruby></p>\n')
    });

    it('should test bold furigana markdown', () => {
        const result = md.render('**福（ふく）**')
        expect(result).toBe('<p><strong><ruby><rb>福</rb><rp>（</rp><rt>ふく</rt><rp>）</rp></ruby></strong></p>\n')
    });

    it('should test mixed text and furigana', () => {
        const result = md.render('This is a manekineko : これは招（まね）き猫（ねこ）')
        expect(result).toBe('<p>This is a manekineko : これは<ruby><rb>招</rb><rp>（</rp><rt>まね</rt><rp>）</rp></ruby>き<ruby><rb>猫</rb><rp>（</rp><rt>ねこ</rt><rp>）</rp></ruby></p>\n')
    });

    it('should test complexe furigana markdown rendering', () => {
        const input = `# title

blah 車（くるま）**blahblah**

# footer`;

        const result = md.render(input);
        expect(result).toBe(`<h1>title</h1>
<p>blah <ruby><rb>車</rb><rp>（</rp><rt>くるま</rt><rp>）</rp></ruby><strong>blahblah</strong></p>
<h1>footer</h1>\n`);
    });
});